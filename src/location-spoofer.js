/*
 * 拦截 Apple /clls/wloc 接口的回应，解 ARPC 封包，改 WiFi 热点和基站坐标，
 * 再按 Apple 的格式封回去返回给系统。
 *
 * 主要流程：
 *   ARPC 拆包 → protobuf 解字段 → 替换 Location 子消息的坐标/精度/运动状态
 *   → protobuf 重新打包 → 按原格式（ARPC / marker / synthetic）封回
 */
(function () {
  "use strict";

  var DEFAULT_CONFIG = {
    enabled: false,
    mode: "response",
    latitude: 37.3349,
    longitude: -122.00902,
    horizontalAccuracy: 39,
    verticalAccuracy: 1000,
    randomRadius: 0,
    altitude: 530,
    unknownValue4: 3,
    motionActivityType: 63,
    motionActivityConfidence: 467,
    failOpen: true,
    debug: false,
    dumpRaw: false,
    dumpHeaders: false,
    prepareHeaders: false,
    rawLimit: 0
  };

  var APPLE_WLOC_PREFIX = bytesFromArray([0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]);
  var APPLE_WLOC_MARKER = bytesFromArray([0x00, 0x00, 0x00, 0x01, 0x00, 0x00]);
  var ROOT_DROP_FIELDS = { 3: true, 4: true, 33: true };
  var CELL_RESPONSE_FIELDS = { 22: true, 24: true };
  var LOCATION_REPLACED_FIELDS = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    11: true,
    12: true
  };

  function bytesFromArray(values) {
    return new Uint8Array(values);
  }

  function concatBytes(parts) {
    var total = 0;
    var i;
    for (i = 0; i < parts.length; i += 1) {
      total += parts[i].length;
    }

    var out = new Uint8Array(total);
    var offset = 0;
    for (i = 0; i < parts.length; i += 1) {
      out.set(parts[i], offset);
      offset += parts[i].length;
    }
    return out;
  }

  function bytesEqualPrefix(bytes, prefix) {
    if (!bytes || bytes.length < prefix.length) {
      return false;
    }
    for (var i = 0; i < prefix.length; i += 1) {
      if (bytes[i] !== prefix[i]) {
        return false;
      }
    }
    return true;
  }

  function findBytes(bytes, marker) {
    if (!bytes || !marker || marker.length === 0) {
      return -1;
    }
    for (var i = 0; i <= bytes.length - marker.length; i += 1) {
      var ok = true;
      for (var j = 0; j < marker.length; j += 1) {
        if (bytes[i + j] !== marker[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        return i;
      }
    }
    return -1;
  }

  function tryParseFields(bytes) {
    try {
      if (!bytes || bytes.length === 0) {
        return null;
      }
      var fields = parseFields(bytes);
      return fields.length > 0 ? fields : null;
    } catch (e) {
      return null;
    }
  }

  function binaryStringToBytes(value) {
    var out = new Uint8Array(value.length);
    for (var i = 0; i < value.length; i += 1) {
      out[i] = value.charCodeAt(i) & 0xff;
    }
    return out;
  }

  function bytesToBinaryString(bytes) {
    var chunkSize = 0x8000;
    var chunks = [];
    for (var i = 0; i < bytes.length; i += chunkSize) {
      var chunk = bytes.subarray(i, i + chunkSize);
      chunks.push(String.fromCharCode.apply(null, Array.prototype.slice.call(chunk)));
    }
    return chunks.join("");
  }

  function bytesToBase64(bytes) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "";
    for (var i = 0; i < bytes.length; i += 3) {
      var b0 = bytes[i];
      var b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
      var b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
      var triplet = (b0 << 16) | (b1 << 8) | b2;
      out += alphabet[(triplet >> 18) & 0x3f];
      out += alphabet[(triplet >> 12) & 0x3f];
      out += i + 1 < bytes.length ? alphabet[(triplet >> 6) & 0x3f] : "=";
      out += i + 2 < bytes.length ? alphabet[triplet & 0x3f] : "=";
    }
    return out;
  }

  function hexPreview(bytes, limit) {
    if (!bytes) {
      return "<none>";
    }
    var out = [];
    var max = Math.min(bytes.length, limit || 16);
    for (var i = 0; i < max; i += 1) {
      out.push(("0" + bytes[i].toString(16)).slice(-2));
    }
    return out.join("");
  }

  function bodyToBytes(body) {
    if (body == null) {
      return null;
    }
    if (body instanceof Uint8Array) {
      return body;
    }
    if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
      return new Uint8Array(body);
    }
    if (typeof body === "string") {
      return binaryStringToBytes(body);
    }
    if (typeof body === "object" && typeof body.length === "number") {
      return new Uint8Array(body);
    }
    if (typeof body === "object" && body.bytes && typeof body.bytes.length === "number") {
      return new Uint8Array(body.bytes);
    }
    if (typeof body === "object" && body.data && typeof body.data.length === "number") {
      return new Uint8Array(body.data);
    }
    return null;
  }

  function messageBodyToBytes(message) {
    if (!message) {
      return null;
    }
    return (
      bodyToBytes(message.bodyBytes) ||
      bodyToBytes(message.body) ||
      bodyToBytes(message.rawBody) ||
      bodyToBytes(message.binaryBody)
    );
  }

  function readUInt16BE(bytes, offset) {
    if (offset + 2 > bytes.length) {
      throw new Error("uint16 out of range");
    }
    return (bytes[offset] << 8) | bytes[offset + 1];
  }

  function readUInt32BE(bytes, offset) {
    if (offset + 4 > bytes.length) {
      throw new Error("uint32 out of range");
    }
    return (
      (bytes[offset] * 0x1000000) +
      ((bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3])
    ) >>> 0;
  }

  function writeUInt16BE(value) {
    if (value < 0 || value > 0xffff) {
      throw new Error("uint16 value out of range: " + value);
    }
    return bytesFromArray([(value >> 8) & 0xff, value & 0xff]);
  }

  function writeUInt32BE(value) {
    return bytesFromArray([
      (value >>> 24) & 0xff,
      (value >>> 16) & 0xff,
      (value >>> 8) & 0xff,
      value & 0xff
    ]);
  }

  function asciiBytes(value) {
    var out = new Uint8Array(value.length);
    for (var i = 0; i < value.length; i += 1) {
      out[i] = value.charCodeAt(i) & 0x7f;
    }
    return out;
  }

  function encodeVarintUnsigned(value) {
    var v = typeof value === "bigint" ? value : BigInt(value);
    if (v < 0n) {
      throw new Error("negative unsigned varint");
    }

    var out = [];
    while (v >= 0x80n) {
      out.push(Number((v & 0x7fn) | 0x80n));
      v >>= 7n;
    }
    out.push(Number(v));
    return bytesFromArray(out);
  }

  function encodeVarintSignedInt64(value) {
    var v = typeof value === "bigint" ? value : BigInt(Math.trunc(value));
    if (v < 0n) {
      v = BigInt.asUintN(64, v);
    }
    return encodeVarintUnsigned(v);
  }

  function decodeVarint(bytes, offset) {
    var result = 0n;
    var shift = 0n;
    var current = offset;

    while (current < bytes.length) {
      var b = bytes[current];
      current += 1;
      result |= BigInt(b & 0x7f) << shift;
      if ((b & 0x80) === 0) {
        return { value: result, offset: current };
      }
      shift += 7n;
      if (shift > 70n) {
        throw new Error("varint too long");
      }
    }

    throw new Error("unterminated varint");
  }

  function makeKey(fieldNumber, wireType) {
    return encodeVarintUnsigned((BigInt(fieldNumber) << 3n) | BigInt(wireType));
  }

  function makeVarintField(fieldNumber, value) {
    return concatBytes([makeKey(fieldNumber, 0), encodeVarintSignedInt64(value)]);
  }

  function makeLengthDelimitedField(fieldNumber, payload) {
    return concatBytes([makeKey(fieldNumber, 2), encodeVarintUnsigned(payload.length), payload]);
  }

  function parseFields(bytes) {
    var fields = [];
    var offset = 0;

    while (offset < bytes.length) {
      var keyStart = offset;
      var key = decodeVarint(bytes, offset);
      offset = key.offset;

      var fieldNumber = Number(key.value >> 3n);
      var wireType = Number(key.value & 0x7n);
      if (fieldNumber === 0) {
        throw new Error("protobuf field number 0");
      }

      var valueStart = offset;
      var valueEnd;
      if (wireType === 0) {
        valueEnd = decodeVarint(bytes, offset).offset;
      } else if (wireType === 1) {
        valueEnd = offset + 8;
      } else if (wireType === 2) {
        var lengthInfo = decodeVarint(bytes, offset);
        var length = Number(lengthInfo.value);
        valueStart = lengthInfo.offset;
        valueEnd = valueStart + length;
      } else if (wireType === 5) {
        valueEnd = offset + 4;
      } else {
        throw new Error("unsupported protobuf wire type: " + wireType);
      }

      if (valueEnd > bytes.length) {
        throw new Error("protobuf field exceeds buffer");
      }

      fields.push({
        fieldNumber: fieldNumber,
        wireType: wireType,
        keyStart: keyStart,
        valueStart: valueStart,
        valueEnd: valueEnd,
        end: valueEnd,
        raw: bytes.slice(keyStart, valueEnd),
        valueBytes: bytes.slice(valueStart, valueEnd)
      });
      offset = valueEnd;
    }

    return fields;
  }

  function firstFieldByNumber(fields, fieldNumber) {
    for (var i = 0; i < fields.length; i += 1) {
      if (fields[i].fieldNumber === fieldNumber) {
        return fields[i];
      }
    }
    return null;
  }

  function signedVarintFieldValue(field) {
    if (!field || field.wireType !== 0) {
      return null;
    }
    return BigInt.asIntN(64, decodeVarint(field.valueBytes, 0).value);
  }

  function locationSummary(locationPayload) {
    try {
      var fields = parseFields(locationPayload);
      var lat = signedVarintFieldValue(firstFieldByNumber(fields, 1));
      var lon = signedVarintFieldValue(firstFieldByNumber(fields, 2));
      if (lat == null || lon == null) {
        return "<missing>";
      }
      return (Number(lat) / 100000000).toFixed(8) + "," + (Number(lon) / 100000000).toFixed(8);
    } catch (err) {
      return "<parse-failed:" + err.message + ">";
    }
  }

  function patchedPayloadSummary(payload) {
    try {
      var rootFields = parseFields(payload);
      var parts = [];
      var wifi = firstFieldByNumber(rootFields, 2);
      if (wifi && wifi.wireType === 2) {
        var wifiLocation = firstFieldByNumber(parseFields(wifi.valueBytes), 2);
        parts.push("firstWifi=" + (wifiLocation ? locationSummary(wifiLocation.valueBytes) : "<missing>"));
      }
      var cell = firstCellResponseField(rootFields);
      if (cell && cell.wireType === 2) {
        var cellLocation = firstFieldByNumber(parseFields(cell.valueBytes), 5);
        parts.push("firstCell=" + (cellLocation ? locationSummary(cellLocation.valueBytes) : "<missing>"));
      }
      return parts.length ? parts.join(", ") : "no wifi/cell location fields";
    } catch (err) {
      return "summary failed: " + err.message;
    }
  }

  function isCellResponseField(fieldNumber) {
    return CELL_RESPONSE_FIELDS[fieldNumber] === true;
  }

  function firstCellResponseField(fields) {
    for (var i = 0; i < fields.length; i += 1) {
      if (isCellResponseField(fields[i].fieldNumber)) {
        return fields[i];
      }
    }
    return null;
  }

  function coordToInt(value) {
    return Math.trunc(Number(value) * 100000000);
  }

  function parseBoolean(value, defaultValue) {
    if (value === true || value === false) {
      return value;
    }
    if (typeof value === "string") {
      var normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on") {
        return true;
      }
      if (normalized === "false" || normalized === "0" || normalized === "no" || normalized === "off") {
        return false;
      }
    }
    return defaultValue;
  }

  function normalizeConfig(input) {
    var cfg = {};
    var key;
    for (key in DEFAULT_CONFIG) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key)) {
        cfg[key] = DEFAULT_CONFIG[key];
      }
    }
    input = input || {};
    for (key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        cfg[key] = input[key];
      }
    }

    cfg.enabled = parseBoolean(cfg.enabled, true);
    cfg.failOpen = parseBoolean(cfg.failOpen, true);
    var mode = String(cfg.mode || "response").toLowerCase();
    cfg.mode = mode === "request" || mode === "prepare" || mode === "probe" || mode === "inspect" ? mode : "response";
    cfg.latitude = Number(cfg.latitude);
    cfg.longitude = Number(cfg.longitude);
    cfg.horizontalAccuracy = Math.trunc(Number(cfg.horizontalAccuracy));
    cfg.verticalAccuracy = Math.trunc(Number(cfg.verticalAccuracy));
    cfg.altitude = Math.trunc(Number(cfg.altitude));
    cfg.unknownValue4 = Math.trunc(Number(cfg.unknownValue4));
    cfg.motionActivityType = Math.trunc(Number(cfg.motionActivityType));
    cfg.motionActivityConfidence = Math.trunc(Number(cfg.motionActivityConfidence));
    cfg.dumpRaw = cfg.dumpRaw === true || String(cfg.dumpRaw).toLowerCase() === "true";
    cfg.dumpHeaders = cfg.dumpHeaders === true || String(cfg.dumpHeaders).toLowerCase() === "true";
    cfg.prepareHeaders = cfg.prepareHeaders === true || String(cfg.prepareHeaders).toLowerCase() === "true";
    cfg.rawLimit = Math.trunc(Number(cfg.rawLimit || 0));
    if (!Number.isFinite(cfg.rawLimit) || cfg.rawLimit < 0) {
      cfg.rawLimit = 0;
    }
    cfg.randomRadius = Number(cfg.randomRadius);
    if (!Number.isFinite(cfg.randomRadius) || cfg.randomRadius < 0) {
      cfg.randomRadius = 0;
    }

    if (!Number.isFinite(cfg.latitude) || cfg.latitude < -90 || cfg.latitude > 90) {
      throw new Error("invalid latitude");
    }
    if (!Number.isFinite(cfg.longitude) || cfg.longitude < -180 || cfg.longitude > 180) {
      throw new Error("invalid longitude");
    }
    if (cfg.randomRadius > 0) {
      var jittered = applyRandomRadius(cfg.latitude, cfg.longitude, cfg.randomRadius);
      cfg.latitude = jittered.latitude;
      cfg.longitude = jittered.longitude;
      cfg.randomDistance = jittered.distance;
    }
    return cfg;
  }

  function applyRandomRadius(lat, lon, radiusMeters) {
    var r = Number(radiusMeters);
    if (!Number.isFinite(r) || r <= 0) {
      return { latitude: lat, longitude: lon, distance: 0 };
    }
    var distance = Math.sqrt(Math.random()) * r;
    var bearing = 2 * Math.random() * Math.PI;
    var angular = distance / 6378137;
    var latRad = (lat * Math.PI) / 180;
    var lonRad = (lon * Math.PI) / 180;
    var newLat = Math.asin(
      Math.sin(latRad) * Math.cos(angular) +
        Math.cos(latRad) * Math.sin(angular) * Math.cos(bearing)
    );
    var newLon =
      ((lonRad +
        Math.atan2(
          Math.sin(bearing) * Math.sin(angular) * Math.cos(latRad),
          Math.cos(angular) - Math.sin(latRad) * Math.sin(newLat)
        ) +
        3 * Math.PI) %
        (2 * Math.PI)) -
      Math.PI;
    return {
      latitude: Number(((newLat * 180) / Math.PI).toFixed(8)),
      longitude: Number(((newLon * 180) / Math.PI).toFixed(8)),
      distance: distance
    };
  }

  function patchLocation(locationPayload, config) {
    var parts = [];
    var fields = locationPayload.length ? parseFields(locationPayload) : [];
    for (var i = 0; i < fields.length; i += 1) {
      if (!LOCATION_REPLACED_FIELDS[fields[i].fieldNumber]) {
        parts.push(fields[i].raw);
      }
    }

    parts.push(makeVarintField(1, coordToInt(config.latitude)));
    parts.push(makeVarintField(2, coordToInt(config.longitude)));
    parts.push(makeVarintField(3, config.horizontalAccuracy));
    parts.push(makeVarintField(4, config.unknownValue4));
    parts.push(makeVarintField(5, config.altitude));
    parts.push(makeVarintField(6, config.verticalAccuracy));
    parts.push(makeVarintField(11, config.motionActivityType));
    parts.push(makeVarintField(12, config.motionActivityConfidence));
    return concatBytes(parts);
  }

  function patchWifiDevice(wifiPayload, config) {
    var fields = parseFields(wifiPayload);
    var parts = [];
    var patchedLocation = false;

    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      if (field.fieldNumber === 2 && field.wireType === 2) {
        parts.push(makeLengthDelimitedField(2, patchLocation(field.valueBytes, config)));
        patchedLocation = true;
      } else {
        parts.push(field.raw);
      }
    }

    if (!patchedLocation) {
      parts.push(makeLengthDelimitedField(2, patchLocation(bytesFromArray([]), config)));
    }

    return concatBytes(parts);
  }

  function patchCellTower(cellPayload, config) {
    var fields = parseFields(cellPayload);
    var parts = [];
    var patchedLocation = false;

    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      if (field.fieldNumber === 5 && field.wireType === 2) {
        parts.push(makeLengthDelimitedField(5, patchLocation(field.valueBytes, config)));
        patchedLocation = true;
      } else {
        parts.push(field.raw);
      }
    }

    if (!patchedLocation) {
      parts.push(makeLengthDelimitedField(5, patchLocation(bytesFromArray([]), config)));
    }

    return concatBytes(parts);
  }

  function patchAppleWLocPayload(payload, config) {
    var fields = parseFields(payload);
    var parts = [];
    var wifiCount = 0;
    var cellCount = 0;

    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      if (field.fieldNumber === 2 && field.wireType === 2) {
        parts.push(makeLengthDelimitedField(2, patchWifiDevice(field.valueBytes, config)));
        wifiCount += 1;
      } else if (isCellResponseField(field.fieldNumber) && field.wireType === 2) {
        parts.push(makeLengthDelimitedField(field.fieldNumber, patchCellTower(field.valueBytes, config)));
        cellCount += 1;
      } else if (!ROOT_DROP_FIELDS[field.fieldNumber]) {
        parts.push(field.raw);
      }
    }

    return { payload: concatBytes(parts), wifiCount: wifiCount, cellCount: cellCount };
  }

  function readPascalString(bytes, state) {
    var length = readUInt16BE(bytes, state.offset);
    state.offset += 2;
    if (state.offset + length > bytes.length) {
      throw new Error("ARPC pascal string exceeds buffer");
    }

    var chars = [];
    for (var i = 0; i < length; i += 1) {
      chars.push(String.fromCharCode(bytes[state.offset + i]));
    }
    state.offset += length;
    return chars.join("");
  }

  function writePascalString(value) {
    var bytes = asciiBytes(value);
    return concatBytes([writeUInt16BE(bytes.length), bytes]);
  }

  function parseArpc(bytes) {
    var state = { offset: 0 };
    var version = readUInt16BE(bytes, state.offset);
    state.offset += 2;
    var locale = readPascalString(bytes, state);
    var appIdentifier = readPascalString(bytes, state);
    var osVersion = readPascalString(bytes, state);
    var functionId = readUInt32BE(bytes, state.offset);
    state.offset += 4;
    var payloadLength = readUInt32BE(bytes, state.offset);
    state.offset += 4;

    if (state.offset + payloadLength > bytes.length) {
      throw new Error("ARPC payload exceeds buffer");
    }

    return {
      version: version,
      locale: locale,
      appIdentifier: appIdentifier,
      osVersion: osVersion,
      functionId: functionId,
      payload: bytes.slice(state.offset, state.offset + payloadLength)
    };
  }

  function serializeArpc(arpc) {
    return concatBytes([
      writeUInt16BE(arpc.version),
      writePascalString(arpc.locale),
      writePascalString(arpc.appIdentifier),
      writePascalString(arpc.osVersion),
      writeUInt32BE(arpc.functionId),
      writeUInt32BE(arpc.payload.length),
      arpc.payload
    ]);
  }

  function buildAppleWLocResponse(payload, prefix) {
    return concatBytes([prefix || APPLE_WLOC_PREFIX, writeUInt16BE(payload.length), payload]);
  }

  function extractPrefixedAppleWLocPayload(responseBytes) {
    if (!responseBytes || responseBytes.length < 10) {
      return null;
    }
    if (responseBytes[0] !== 0x00 || responseBytes[1] !== 0x01) {
      return null;
    }
    if (responseBytes[6] !== 0x00 || responseBytes[7] !== 0x00) {
      return null;
    }

    var payloadLength = readUInt16BE(responseBytes, 8);
    var payloadOffset = 10;
    if (payloadLength <= 0 || payloadOffset + payloadLength > responseBytes.length) {
      return null;
    }

    var payload = responseBytes.slice(payloadOffset, payloadOffset + payloadLength);
    if (tryParseFields(payload) === null) {
      return null;
    }

    return {
      kind: "synthetic",
      payload: payload,
      prefix: responseBytes.slice(0, 8),
      suffix: responseBytes.slice(payloadOffset + payloadLength)
    };
  }

  function extractAppleWLocPayload(responseBytes) {
    if (!responseBytes || responseBytes.length < 2) {
      throw new Error("Apple WLoc response too short");
    }

    var prefixed = extractPrefixedAppleWLocPayload(responseBytes);
    if (prefixed) {
      return prefixed;
    }

    try {
      var arpc = parseArpc(responseBytes);
      if (arpc.payload.length > 0 && tryParseFields(arpc.payload) !== null) {
        return {
          kind: "arpc",
          payload: arpc.payload,
          arpc: arpc
        };
      }
    } catch (e) {
    }

    var markerIdx = findBytes(responseBytes, APPLE_WLOC_MARKER);
    if (markerIdx >= 0) {
      var lenOffset = markerIdx + APPLE_WLOC_MARKER.length;
      if (lenOffset + 2 <= responseBytes.length) {
        var realLen = readUInt16BE(responseBytes, lenOffset);
        var realPayloadOffset = lenOffset + 2;
        if (realLen > 0 && realPayloadOffset + realLen <= responseBytes.length) {
          var candidatePayload = responseBytes.slice(realPayloadOffset, realPayloadOffset + realLen);
          if (tryParseFields(candidatePayload) !== null) {
            return {
              kind: "marker",
              payload: candidatePayload,
              prefix: responseBytes.slice(0, markerIdx),
              markerAndLen: responseBytes.slice(markerIdx, realPayloadOffset),
              suffix: responseBytes.slice(realPayloadOffset + realLen)
            };
          }
        }
      }
    }

    if (looksLikeAppleWLocPayload(responseBytes)) {
      return {
        kind: "bare",
        payload: responseBytes
      };
    }

    throw new Error("missing Apple WLoc response prefix");
  }

  function looksLikeAppleWLocPayload(bytes) {
    if (!bytes || bytes.length === 0) {
      return false;
    }
    var tag = bytes[0];
    var fieldNumber = tag >> 3;
    var wireType = tag & 0x7;
    return fieldNumber > 0 && (wireType === 0 || wireType === 2);
  }

  function spoofArpcRequest(requestBytes, configInput) {
    var config = normalizeConfig(configInput);
    var arpc = parseArpc(requestBytes);
    var patched = patchAppleWLocPayload(arpc.payload, config);
    return {
      response: buildAppleWLocResponse(patched.payload),
      payload: patched.payload,
      wifiCount: patched.wifiCount,
      cellCount: patched.cellCount,
      arpc: arpc
    };
  }

  function spoofAppleResponse(responseBytes, configInput) {
    var config = normalizeConfig(configInput);
    var extraction = extractAppleWLocPayload(responseBytes);
    var patched = patchAppleWLocPayload(extraction.payload, config);
    var response;

    if (extraction.kind === "arpc") {
      var arpcOut = {
        version: extraction.arpc.version,
        locale: extraction.arpc.locale,
        appIdentifier: extraction.arpc.appIdentifier,
        osVersion: extraction.arpc.osVersion,
        functionId: extraction.arpc.functionId,
        payload: patched.payload
      };
      response = serializeArpc(arpcOut);
    } else if (extraction.kind === "marker") {
      var newLenBytes = writeUInt16BE(patched.payload.length);
      response = concatBytes([
        extraction.prefix,
        extraction.markerAndLen.slice(0, APPLE_WLOC_MARKER.length),
        newLenBytes,
        patched.payload,
        extraction.suffix
      ]);
    } else {
      response = buildAppleWLocResponse(patched.payload, extraction.prefix);
    }

    return {
      response: response,
      payload: patched.payload,
      wifiCount: patched.wifiCount,
      cellCount: patched.cellCount,
      kind: extraction.kind,
      prefix: extraction.prefix ? hexPreview(extraction.prefix, 8) : ""
    };
  }

  function parseArgumentString(argument) {
    var result = {};
    if (!argument || typeof argument !== "string") {
      return result;
    }

    var tailKeys = [
      "debug",
      "mode",
      "enabled",
      "latitude",
      "longitude",
      "altitude",
      "address",
      "configHost",
      "configToken",
      "horizontalAccuracy",
      "verticalAccuracy",
      "randomRadius",
      "unknownValue4",
      "motionActivityType",
      "motionActivityConfidence",
      "failOpen",
      "dumpRaw",
      "dumpHeaders",
      "prepareHeaders",
      "rawLimit"
    ];
    var configUrlKey = "configUrl=";
    var configUrlIdx = argument.indexOf(configUrlKey);
    if (configUrlIdx >= 0) {
      var valueStart = configUrlIdx + configUrlKey.length;
      var tail = argument.slice(valueStart);
      var end = -1;
      var i;
      for (i = 0; i < tailKeys.length; i += 1) {
        var marker = "&" + tailKeys[i] + "=";
        var pos = tail.indexOf(marker);
        if (pos >= 0 && (end < 0 || pos < end)) {
          end = pos;
        }
      }
      var configUrlValue = end >= 0 ? tail.slice(0, end) : tail;
      try {
        result.configUrl = decodeURIComponent(configUrlValue);
      } catch (err) {
        result.configUrl = configUrlValue;
      }
      argument = argument.slice(0, configUrlIdx) + (end >= 0 ? tail.slice(end + 1) : "");
    }

    var pairs = argument.split(/[&;]/);
    for (var j = 0; j < pairs.length; j += 1) {
      var part = pairs[j];
      if (!part) {
        continue;
      }
      var eq = part.indexOf("=");
      var key = eq >= 0 ? part.slice(0, eq) : part;
      var value = eq >= 0 ? part.slice(eq + 1) : "true";
      try {
        result[decodeURIComponent(key)] = decodeURIComponent(value);
      } catch (err2) {
        result[key] = value;
      }
    }
    return result;
  }

  function resolveConfigUrl(args) {
    args = args || {};
    var direct = String(args.configUrl || args.cfg || args.url || "").trim();
    if (direct) {
      return direct;
    }
    var host = String(args.configHost || "").trim().replace(/\/+$/, "");
    var token = String(args.configToken || "").trim();
    if (host && token) {
      return host + "/loc.json?token=" + encodeURIComponent(token);
    }
    return "";
  }

  function isPlaceholderValue(value) {
    return typeof value === "string" && /^\{[^}]+\}$/.test(value.trim());
  }

  function readPluginStoreArg(name) {
    if (typeof $persistentStore === "undefined" || !$persistentStore.read) {
      return null;
    }
    try {
      var value = $persistentStore.read(name);
      return value == null || value === "" ? null : String(value);
    } catch (err) {
      return null;
    }
  }

  function enrichArgsFromPluginStore(args) {
    var keys = [
      "enabled",
      "latitude",
      "longitude",
      "altitude",
      "horizontalAccuracy",
      "verticalAccuracy",
      "randomRadius",
      "address",
      "configHost",
      "configToken",
      "configUrl",
      "debug"
    ];
    var i;
    args = args || {};
    for (i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var current = args[key];
      if (current == null || current === "" || isPlaceholderValue(current)) {
        var stored = readPluginStoreArg(key);
        if (stored != null && !isPlaceholderValue(stored)) {
          args[key] = stored;
        }
      }
    }
    return args;
  }

  function readScriptArguments() {
    var out = {};
    if (typeof $argument !== "undefined" && $argument != null) {
      if (typeof $argument === "string") {
        out = parseArgumentString($argument);
      } else if (typeof $argument === "object") {
        var key;
        for (key in $argument) {
          if (Object.prototype.hasOwnProperty.call($argument, key)) {
            var value = $argument[key];
            out[key] = value == null ? "" : String(value);
          }
        }
      } else {
        out = parseArgumentString(String($argument));
      }
    }
    return enrichArgsFromPluginStore(out);
  }

  function logScriptArguments(debug) {
    if (!debug) {
      return;
    }
    var args = readScriptArguments();
    var raw =
      typeof $argument === "undefined" || $argument == null
        ? "<none>"
        : typeof $argument === "object"
          ? JSON.stringify($argument)
          : String($argument);
    console.log("Location spoofer $argument raw: " + raw);
    console.log("Location spoofer resolved config url: " + resolveConfigUrl(args));
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      DEFAULT_CONFIG: DEFAULT_CONFIG,
      spoofAppleResponse: spoofAppleResponse,
      spoofArpcRequest: spoofArpcRequest,
      readScriptArguments: readScriptArguments
    };
  }

  if (typeof $response !== "undefined") {
    try {
      var args = readScriptArguments();
      if (args.enabled !== false) {
        var rawBody = messageBodyToBytes($response);
        if (rawBody) {
          var spoofed = spoofAppleResponse(rawBody, args);
          $done({ body: spoofed.response });
        } else {
          $done({});
        }
      } else {
        $done({});
      }
    } catch (e) {
      if (typeof console !== "undefined" && console.log) {
        console.log("spoof error: " + e.message);
      }
      $done({});
    }
  }
})();
