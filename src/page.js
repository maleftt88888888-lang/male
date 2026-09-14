export function getPageHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>iOS Location Spoofer</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="iOSLoc">
<meta name="theme-color" content="#0a0c11">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icon-180.png">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
:root {
  --bg:#0a0c11; --card:#12161d; --card2:#191e28; --line:#242b38; --inset:rgba(255,255,255,.045);
  --cyan:#17c3cf; --cyan2:#0e97a1; --green:#22c55e; --red:#ff5b60; --orange:#f5a623;
  --txt:#eef2f8; --muted:#8a93a5; --mono:#7fe3ea; --gray:#8a93a5;
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family:-apple-system,system-ui,"SF Pro","Helvetica Neue",sans-serif;
  color:var(--txt);
  background:
    radial-gradient(900px 380px at 50% -120px, rgba(23,195,207,.14), transparent 70%),
    radial-gradient(600px 300px at 92% 6%, rgba(34,197,94,.07), transparent 65%),
    var(--bg);
  background-attachment:fixed;
}
::placeholder { color:#5d6675; }
::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-thumb { background:#2b3342; border-radius:3px; }

.topbar { position:sticky; top:0; z-index:1200; display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:rgba(10,12,17,.82); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); border-bottom:1px solid var(--line); font-size:13px; color:var(--txt); font-weight:700; }
.topbar .back { color:var(--cyan); font-weight:700; text-decoration:none; }

#map { height:50vh; width:100%; min-height:260px; background:#0a0c11; border-bottom:1px solid var(--line); }
.leaflet-container { background:#0a0c11; }
.leaflet-control-zoom a { background:rgba(18,22,29,.9)!important; color:var(--txt)!important; border-color:var(--line)!important; -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
.leaflet-control-zoom a:hover { background:var(--card2)!important; }
.leaflet-bar { border:1px solid var(--line)!important; box-shadow:0 4px 18px rgba(0,0,0,.5)!important; }
.leaflet-control-attribution { background:rgba(10,12,17,.7)!important; color:#6b7484!important; }
.leaflet-control-attribution a { color:#8a93a5!important; }

.panel { padding:16px; max-width:600px; margin:0 auto; padding-bottom:calc(16px + env(safe-area-inset-bottom)); }

.card { background:linear-gradient(180deg,rgba(25,30,40,.72),rgba(18,22,29,.72)); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border:1px solid var(--line); border-radius:16px; padding:16px; margin-bottom:12px; box-shadow:0 8px 28px rgba(0,0,0,.34); }
.card h3 { font-size:15px; font-weight:700; margin-bottom:12px; color:var(--txt); display:flex; align-items:center; gap:8px; }
.card h3::before { content:""; width:3px; height:14px; border-radius:2px; background:linear-gradient(180deg,var(--cyan),var(--green)); flex:none; }

.coords { font-family:"SF Mono",ui-monospace,monospace; font-size:13.5px; color:var(--muted); padding:10px 12px; background:var(--inset); border:1px solid var(--line); border-radius:10px; word-break:break-all; }
.crow { display:flex; align-items:center; gap:8px; padding:8px 12px; background:var(--inset); border:1px solid var(--line); border-radius:10px; margin-bottom:6px; }
.crow .ck { font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:var(--cyan); width:34px; flex:none; }
.crow .cv { flex:1; min-width:0; font-family:"SF Mono",ui-monospace,monospace; font-size:14px; color:var(--mono); word-break:break-all; }
.copybtn { flex:none; }

.row { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
.btn { flex:1; min-width:100px; padding:12px 16px; border:none; border-radius:11px; font-size:14px; font-weight:700; cursor:pointer; transition:all .15s; }
.btn-primary { background:linear-gradient(135deg,var(--cyan),var(--cyan2)); color:#022a2d; box-shadow:0 6px 18px rgba(23,195,207,.28); }
.btn-primary:active { filter:brightness(1.12); transform:scale(.97); }
.btn-secondary { background:var(--card2); color:#c3ccdb; border:1px solid var(--line); font-weight:600; }
.btn-secondary:active { background:#2a3140; transform:scale(.97); }
.btn-danger { background:transparent; color:#ff6b70; border:1px solid rgba(255,91,96,.55); }
.btn-danger:active { background:rgba(255,91,96,.12); transform:scale(.97); }
.btn.success { background:linear-gradient(135deg,#2ee06a,#129a44); color:#04240f; border:none; box-shadow:0 6px 18px rgba(34,197,94,.3); }
.btn-sm { flex:none; min-width:auto; padding:6px 12px; font-size:12px; border-radius:8px; }

.input-row { display:flex; gap:8px; margin-top:10px; }
.input-row input { flex:1; padding:10px 12px; background:var(--inset); border:1px solid var(--line); border-radius:10px; font-size:14px; color:var(--txt); outline:none; min-width:0; -webkit-appearance:none; transition:border-color .15s,box-shadow .15s; }
.cvi { flex:1; min-width:0; width:100%; font-family:"SF Mono",ui-monospace,monospace; font-size:14px; color:var(--mono); padding:6px 10px; background:var(--inset); border:1px solid var(--line); border-radius:8px; outline:none; -webkit-appearance:none; transition:border-color .15s,box-shadow .15s; }
.accfield input { width:100%; padding:8px 10px; background:var(--inset); border:1px solid var(--line); border-radius:8px; font-size:14px; color:var(--txt); outline:none; -webkit-appearance:none; transition:border-color .15s,box-shadow .15s; }
.input-row input:focus, .cvi:focus, .accfield input:focus, .modal input:focus { border-color:var(--cyan); box-shadow:0 0 0 3px rgba(23,195,207,.16); }
.acc-row { display:flex; gap:8px; margin-bottom:6px; }
.accfield { flex:1; min-width:0; display:flex; flex-direction:column; gap:4px; }
.acclbl { font-size:11px; color:var(--muted); }

.status { font-size:12px; color:var(--muted); margin-top:8px; text-align:center; }
.hint { font-size:11px; color:#6b7484; margin-top:8px; line-height:1.6; }
.accnote { margin-top:10px; padding:11px 13px; background:var(--inset); border:1px solid var(--line); border-left:3px solid var(--cyan); border-radius:9px; font-size:11.5px; color:#a8b1c0; line-height:1.85; }
.accnote b { display:block; color:var(--cyan); font-weight:800; font-size:12px; margin-bottom:6px; letter-spacing:.3px; }
.accnote code { font-family:"SF Mono",ui-monospace,monospace; color:var(--mono); font-size:11px; }
.accnote em { color:var(--txt); font-style:normal; font-weight:800; }

.search-results { margin-top:8px; max-height:260px; overflow-y:auto; }
.search-item { padding:10px 12px; background:var(--inset); border:1px solid var(--line); border-radius:10px; margin-bottom:6px; cursor:pointer; transition:all .15s; }
.search-item:active { background:#232a37; border-color:var(--cyan); }
.search-item .si-name { font-size:14px; color:var(--txt); font-weight:600; }
.search-item .si-sub { font-size:11px; color:var(--muted); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.error-banner { background:linear-gradient(180deg,rgba(255,91,96,.18),rgba(255,91,96,.08)); border:1px solid rgba(255,91,96,.5); border-left:4px solid var(--red); color:#ffdcdc; padding:14px 16px; border-radius:12px; margin-bottom:12px; font-size:13.5px; line-height:1.6; display:none; }
.error-banner b { display:block; margin-bottom:4px; color:#ff6b70; font-size:14.5px; }

.toast { position:fixed; top:60px; left:50%; transform:translateX(-50%); background:rgba(8,10,14,.92); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border:1px solid var(--line); color:#fff; padding:11px 20px; border-radius:22px; font-size:14px; opacity:0; transition:opacity .3s; pointer-events:none; z-index:9999; max-width:90vw; text-align:center; box-shadow:0 8px 28px rgba(0,0,0,.5); }
.toast.show { opacity:1; }

.active-loc { background:var(--inset); border:1px solid var(--line); border-radius:10px; padding:11px 12px; font-size:13px; color:var(--txt); }
.active-loc .label { font-size:11px; color:var(--muted); margin-bottom:5px; }
.active-loc .value { font-family:"SF Mono",ui-monospace,monospace; font-size:13px; color:var(--mono); }

.fav-list { max-height:240px; overflow-y:auto; }
.fav-item { display:flex; align-items:center; gap:8px; padding:10px 12px; background:var(--inset); border:1px solid var(--line); border-radius:10px; margin-bottom:6px; cursor:pointer; transition:all .15s; }
.fav-item:active { background:#232a37; border-color:var(--cyan); }
.fav-item .fav-info { flex:1; min-width:0; }
.fav-item .fav-name { font-size:14px; font-weight:600; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fav-item .fav-coords { font-size:11px; color:var(--muted); font-family:"SF Mono",ui-monospace,monospace; margin-top:2px; }
.fav-item .fav-del { flex:none; width:28px; height:28px; border:none; border-radius:50%; background:transparent; color:var(--red); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.fav-item .fav-del:hover { background:rgba(255,91,96,.14); }
.fav-empty { text-align:center; color:var(--muted); font-size:13px; padding:16px 0; }
.fav-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.fav-header h3 { margin-bottom:0; }

.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(4,6,10,.66); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); z-index:10000; display:none; align-items:center; justify-content:center; padding:20px; }
.modal-overlay.show { display:flex; }
.modal { background:linear-gradient(180deg,#1a1f29,#12161d); border:1px solid var(--line); border-radius:18px; padding:20px; width:100%; max-width:340px; box-shadow:0 20px 60px rgba(0,0,0,.6); }
.modal h3 { font-size:17px; font-weight:700; margin-bottom:16px; text-align:center; color:var(--txt); }
.modal input { width:100%; padding:12px; background:var(--inset); border:1px solid var(--line); border-radius:10px; font-size:15px; color:var(--txt); outline:none; margin-bottom:12px; -webkit-appearance:none; transition:border-color .15s,box-shadow .15s; }
.modal .modal-btns { display:flex; gap:8px; }
.modal .modal-btns .btn { padding:12px; }

.layer-switch { position:absolute; top:10px; right:10px; z-index:1000; display:flex; gap:4px; background:rgba(10,12,17,.74); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border:1px solid var(--line); border-radius:10px; padding:4px; box-shadow:0 4px 18px rgba(0,0,0,.45); }
.layer-btn { border:none; background:transparent; padding:6px 10px; border-radius:7px; font-size:12px; font-weight:600; color:#a8b1c0; cursor:pointer; transition:all .15s; white-space:nowrap; }
.layer-btn.active { background:linear-gradient(135deg,var(--cyan),var(--cyan2)); color:#022a2d; font-weight:700; }
.lang-switch { position:absolute; top:10px; left:10px; z-index:1000; display:flex; gap:2px; background:rgba(10,12,17,.74); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border:1px solid var(--line); border-radius:10px; padding:4px; box-shadow:0 4px 18px rgba(0,0,0,.45); }
.lang-btn { border:none; background:transparent; padding:6px 11px; border-radius:7px; font-size:12px; font-weight:700; color:#a8b1c0; cursor:pointer; transition:all .15s; }
.lang-btn.active { background:linear-gradient(135deg,var(--cyan),var(--cyan2)); color:#022a2d; }

@media(max-width:480px) { #map { height:44vh; } .panel { padding:12px; } .layer-btn { padding:5px 7px; font-size:11px; } }
</style>
</head>
<body>
<div class="topbar">
  <a class="back" href="/">← 返回主页</a>
  <span>iOS Location Spoofer</span>
</div>

<div style="position:relative">
<div id="map"></div>
<div class="lang-switch">
  <button class="lang-btn" data-lang="zh" onclick="setLang('zh')">中</button>
  <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
</div>
<div class="layer-switch">
  <button class="layer-btn active" data-layer="amap" data-i18n="layer_amap" onclick="switchLayer('amap')">高德</button>
  <button class="layer-btn" data-layer="satellite" data-i18n="layer_satellite" onclick="switchLayer('satellite')">卫星</button>
  <button class="layer-btn" data-layer="wgs84" onclick="switchLayer('wgs84')">WGS84</button>
  <button class="layer-btn" data-layer="voyager" data-i18n="layer_color" onclick="switchLayer('voyager')">彩色</button>
  <button class="layer-btn" data-layer="dark" data-i18n="layer_dark" onclick="switchLayer('dark')">暗色</button>
</div>
</div>

<div class="panel">
  <div class="error-banner" id="errorBanner" data-i18n-html="err_html"></div>
  <div class="card">
    <h3 data-i18n="choose_title">选择目标位置</h3>
    <div class="coords" id="coords" data-i18n="coords_hint">点击地图或使用下方工具选择位置</div>
    <div id="coordGrid" style="display:none">
      <div class="crow"><span class="ck" data-i18n="lat">Lat</span><span class="cv" id="cvLat"></span><button class="btn btn-sm btn-secondary copybtn" data-i18n="copy" onclick="copyField('lat',this)">复制</button></div>
      <div class="crow"><span class="ck" data-i18n="lon">Lon</span><span class="cv" id="cvLon"></span><button class="btn btn-sm btn-secondary copybtn" data-i18n="copy" onclick="copyField('lon',this)">复制</button></div>
      <div class="crow"><span class="ck" data-i18n="alt">Alt</span><input class="cvi" id="altInput" type="number" inputmode="decimal" step="1" /><button class="btn btn-sm btn-secondary copybtn" data-i18n="copy" onclick="copyField('alt',this)">复制</button></div>
      <div class="acc-row">
        <div class="accfield"><span class="acclbl" data-i18n="hacc">水平精度</span><input id="haccInput" type="number" inputmode="numeric" step="1" min="1" value="39" /></div>
        <div class="accfield"><span class="acclbl" data-i18n="vacc">垂直精度</span><input id="vaccInput" type="number" inputmode="numeric" step="1" min="1" value="1000" /></div>
        <div class="accfield"><span class="acclbl" data-i18n="jitter">扰动半径</span><input id="jitterInput" type="number" inputmode="numeric" step="1" min="0" value="0" /></div>
      </div>
    </div>
    <div class="row">
      <button class="btn btn-primary" id="saveBtn" data-i18n="save" onclick="save()">储存到设备</button>
      <button class="btn btn-secondary" data-i18n="restore" onclick="restoreReal()">恢复真实定位</button>
    </div>
    <div class="row">
      <button class="btn btn-secondary" data-i18n="copy_params" onclick="copyParams(this)">复制模块参数</button>
      <button class="btn btn-secondary" data-i18n="add_fav" onclick="addFav()">收藏位置</button>
      <button class="btn btn-secondary" data-i18n="locate" onclick="locateMe()">当前位置</button>
    </div>
    <div class="hint" data-i18n="alt_hint">海拔由 Open-Meteo 自动查询（WGS-84），储存到设备时一并写入。</div>
    <div class="accnote" data-i18n-html="acc_note_html"></div>
  </div>

  <div class="card">
    <div class="fav-header">
      <h3 data-i18n="fav_title">收藏的位置</h3>
      <button class="btn btn-sm btn-secondary" data-i18n="clear_all" onclick="clearAllFav()" id="clearAllBtn" style="display:none">清空全部</button>
    </div>
    <div id="favList" class="fav-list"></div>
  </div>

  <div class="card">
    <h3 data-i18n="active_title">当前生效坐标</h3>
    <div class="active-loc" id="activeLoc">
      <div class="label" data-i18n="active_label">设备本地坐标</div>
      <div class="value" id="activeValue">查询中...</div>
    </div>
    <div class="row">
      <button class="btn btn-sm btn-secondary" data-i18n="refresh" onclick="queryActive()">刷新</button>
      <button class="btn btn-sm btn-danger" data-i18n="clear_data" onclick="clearActive()">清除数据</button>
    </div>
  </div>

  <div class="card">
    <h3 data-i18n="paste_title">粘贴地图链接</h3>
    <div class="input-row">
      <input id="urlInput" data-i18n-ph="paste_ph" placeholder="Apple/Google/高德/百度地图链接 或 经纬度" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" data-i18n="parse" onclick="parseUrl()">解析</button>
    </div>
    <div style="font-size:11px;color:var(--gray);margin-top:6px" data-i18n="paste_hint">支持各大地图分享链接与纯坐标文本（自动转为 WGS-84）</div>
  </div>

  <div class="card">
    <h3 data-i18n="search_title">搜索地点</h3>
    <div class="input-row">
      <input id="searchInput" data-i18n-ph="search_ph" placeholder="输入地名后回车搜索" onkeydown="if(event.key==='Enter')searchPlace()" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" data-i18n="search" onclick="searchPlace()">搜索</button>
    </div>
    <div id="searchResults" class="search-results"></div>
  </div>

  <div class="status" id="status">选好位置后点击「储存到设备」写入代理工具</div>
</div>

<div class="toast" id="toast"></div>

<div class="modal-overlay" id="favModal">
  <div class="modal">
    <h3 data-i18n="modal_title">收藏此位置</h3>
    <input id="favNameInput" data-i18n-ph="modal_ph" placeholder="输入备注名称" maxlength="30" />
    <div style="font-size:12px;color:var(--gray);margin-bottom:12px;text-align:center" id="favModalCoords"></div>
    <div class="modal-btns">
      <button class="btn btn-secondary" data-i18n="cancel" onclick="closeFavModal()">取消</button>
      <button class="btn btn-primary" data-i18n="save_short" onclick="confirmFav()">保存</button>
    </div>
  </div>
</div>

<script>
var SAVE_API = '/ils-settings/save';
var ACTIVE_API = '/ils-settings/active';
var PARSE_API = '/api/parse';
var ELEV_API = 'https://api.open-meteo.com/v1/elevation';
var FAV_KEY = 'ils_favorites';
var LANG_KEY = 'ils_lang';

var lat = 0, lon = 0;
var selected = false;
var elev = null, elevState = 'idle';

var I18N = {
  zh: {
    title: 'iOS 虚拟定位',
    layer_satellite: '卫星', layer_amap: '高德', layer_color: '彩色', layer_standard: '标准', layer_dark: '暗色',
    err_html: '<b>模块未生效</b>请检查以下配置：<br>1. 已安装并启用 iOS Location Spoofer 模块<br>2. MITM 已开启且信任证书<br>3. MITM 主机名包含 gs-loc.apple.com',
    choose_title: '选择目标位置', coords_hint: '点击地图或使用下方工具选择位置',
    save: '储存到设备', add_fav: '收藏位置', locate: '当前位置', copy: '复制', copy_params: '复制模块参数',
    lat: '纬度', lon: '经度', alt: '海拔', alt_querying: '海拔查询中…', alt_na: '海拔不可用',
    alt_hint: '海拔由 Open-Meteo 自动查询（WGS-84），储存到设备时一并写入。',
    acc_note_html: '<b>精度参数提示：</b><br><code>水平精度</code>: 默认 39 米，设为 5~15 更接近正常 GPS。<br><code>扰动半径</code>: 0 为固定坐标，非 0 则在半径内随机偏移。',
    fav_title: '收藏的位置', clear_all: '清空全部', active_title: '当前生效坐标', active_label: '设备本地坐标',
    refresh: '刷新', clear_data: '清除数据', paste_title: '粘贴地图链接', paste_ph: 'Apple/Google/高德/百度地图链接 或 经纬度', parse: '解析',
    paste_hint: '支持各大地图分享链接与纯坐标文本（自动转为 WGS-84）', search_title: '搜索地点', search_ph: '输入地名搜索', search: '搜索',
    status_hint: '选好位置后点击「储存到设备」写入代理工具', modal_title: '收藏此位置', modal_ph: '输入备注名称', cancel: '取消', save_short: '保存',
    acc: '精度', restore: '恢复真实定位', restored: '✓ 已发送恢复请求。请关闭定位服务并重启代理。', hacc: '水平精度', vacc: '垂直精度', jitter: '扰动半径(米)',
    querying: '查询中...', no_saved: '无已保存的坐标', query_failed: '查询失败 (需要代理模块支持)', cleared: '已清除',
    fav_empty: '暂无收藏', active_now: '✓ 当前生效', del: '删除', pick_first: '请先在地图上选择位置', enter_label: '请输入备注',
    clear_fav_confirm: '确定清空所有收藏？', all_cleared: '已清空收藏',
    clear_confirm: '确定清除设备上已保存的坐标？', dev_cleared: '设备坐标已清除',
    clear_failed: '清除失败',
    saving: '储存中...', saved: '✓ 已储存', saved_toast: '✓ 坐标已成功写入模块！', write_failed: '写入失败，请检查模块与 MITM 设置',
    no_geo: '浏览器不支持定位', getting_loc: '获取位置中...', got_loc: '已获取当前位置',
    paste_first: '请粘贴链接或坐标', parse_failed: '解析失败', parsing: '解析中...',
    enter_place: '请输入地名', searching: '搜索中...', search_failed: '搜索失败'
  },
  en: {
    title: 'iOS Location Spoofer',
    layer_satellite: 'Satellite', layer_amap: 'Amap', layer_color: 'Color', layer_standard: 'Standard', layer_dark: 'Dark',
    err_html: '<b>Module Inactive</b> Please verify MITM settings and script installation.',
    choose_title: 'Choose Target Location', coords_hint: 'Tap map to choose a position',
    save: 'Save to Device', add_fav: 'Add Favorite', locate: 'Current Location', copy: 'Copy', copy_params: 'Copy Params',
    lat: 'Lat', lon: 'Lon', alt: 'Alt', alt_querying: 'querying altitude…', alt_na: 'altitude N/A',
    alt_hint: 'Altitude is auto-fetched via Open-Meteo.',
    acc_note_html: '<b>Accuracy Settings:</b><br><code>H. Accuracy</code>: Default 39m.<br><code>Jitter</code>: Set 0 for fixed coords.',
    fav_title: 'Favorites', clear_all: 'Clear All', active_title: 'Active Coordinates', active_label: 'On-device coordinates',
    refresh: 'Refresh', clear_data: 'Clear Data', paste_title: 'Paste Map Link', paste_ph: 'Apple/Google/Amap link or coords', parse: 'Parse',
    paste_hint: 'Supports map URLs or raw coordinates.', search_title: 'Search Place', search_ph: 'Search place name', search: 'Search',
    status_hint: 'Pick a location and click Save to Device', modal_title: 'Add Favorite', modal_ph: 'Label name', cancel: 'Cancel', save_short: 'Save',
    acc: 'Accuracy', restore: 'Restore Real Location', restored: '✓ Location cleared.', hacc: 'H. Acc', vacc: 'V. Acc', jitter: 'Jitter Radius',
    querying: 'Querying...', no_saved: 'No saved coordinates', query_failed: 'Query failed', cleared: 'Cleared',
    fav_empty: 'No favorites', active_now: '✓ Active', del: 'Delete', pick_first: 'Select a position on map first', enter_label: 'Enter a label',
    clear_fav_confirm: 'Clear all favorites?', all_cleared: 'Cleared all',
    clear_confirm: 'Clear saved coordinates?', dev_cleared: 'Coordinates cleared',
    clear_failed: 'Failed',
    saving: 'Saving...', saved: '✓ Saved', saved_toast: '✓ Coordinates updated!', write_failed: 'Write failed, check MITM & module',
    no_geo: 'Geolocation not supported', getting_loc: 'Locating...', got_loc: 'Location retrieved',
    paste_first: 'Paste a link first', parse_failed: 'Parse failed', parsing: 'Parsing...',
    enter_place: 'Enter a location name', searching: 'Searching...', search_failed: 'Search failed'
  }
};

function detectLang() {
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch(e) {}
  return 'zh';
}
var lang = detectLang();

function t(key) {
  var v = I18N[lang][key];
  return v === undefined ? key : v;
}

function applyI18n() {
  document.documentElement.lang = (lang === 'zh' ? 'zh-CN' : 'en');
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(function(el){ el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){ el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  document.querySelectorAll('.lang-btn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
  updateCoords();
  updateStatus();
  renderFavs();
}

function setLang(l) {
  lang = l;
  try { localStorage.setItem(LANG_KEY, l); } catch(e) {}
  applyI18n();
}

var map = L.map('map').setView([39.9042, 116.4074], 12);
var tiles = {
  amap: L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', { subdomains: '1234', maxZoom: 18, attribution: 'Amap' }),
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Esri World Imagery' }),
  wgs84: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: 'OpenStreetMap' }),
  voyager: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: 'CARTO' }),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: 'CARTO' })
};
tiles.amap.addTo(map);

var currentLayer = 'amap';
function switchLayer(name) {
  if (tiles[currentLayer]) map.removeLayer(tiles[currentLayer]);
  tiles[name].addTo(map);
  currentLayer = name;
  document.querySelectorAll('.layer-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-layer') === name);
  });
}

var marker = null;

function setTarget(la, lo, fly) {
  if (fly === undefined) fly = true;
  lat = la; lon = lo; selected = true;
  if (!marker) {
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    marker.setLatLng([lat, lon]);
  }
  if (fly) map.flyTo([lat, lon], Math.max(map.getZoom(), 14));
  updateCoords();
  fetchElevation(lat, lon);
}

map.on('click', function(e){
  setTarget(e.latlng.lat, e.latlng.lng, false);
});

function fetchElevation(la, lo) {
  elevState = 'loading';
  updateCoords();
  fetch(ELEV_API + '?latitude=' + la.toFixed(6) + '&longitude=' + lo.toFixed(6))
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data && data.elevation !== undefined && data.elevation !== null) {
        elev = Math.round(Array.isArray(data.elevation) ? data.elevation[0] : data.elevation);
        elevState = 'ok';
      } else { elevState = 'fail'; }
      updateCoords();
    })
    .catch(function(){ elevState = 'fail'; updateCoords(); });
}

function updateCoords() {
  var cEl = document.getElementById('coords');
  var gEl = document.getElementById('coordGrid');
  if (!selected) {
    cEl.style.display = 'block';
    gEl.style.display = 'none';
    cEl.textContent = t('coords_hint');
    return;
  }
  cEl.style.display = 'none';
  gEl.style.display = 'block';
  document.getElementById('cvLat').textContent = lat.toFixed(6);
  document.getElementById('cvLon').textContent = lon.toFixed(6);
  var altIn = document.getElementById('altInput');
  if (elevState === 'ok' && elev !== null) {
    altIn.value = elev;
  } else if (elevState === 'loading') {
    altIn.placeholder = t('alt_querying');
  } else {
    altIn.placeholder = t('alt_na');
  }
}

function updateStatus() {
  document.getElementById('status').textContent = t('status_hint');
}

function toast(msg) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(function(){ el.classList.remove('show'); }, 3000);
}

function save() {
  if (!selected) return toast(t('pick_first'));
  var btn = document.getElementById('saveBtn');
  btn.disabled = true;
  btn.textContent = t('saving');

  var altVal = parseInt(document.getElementById('altInput').value) || (elev !== null ? elev : 0);
  var hacc = parseInt(document.getElementById('haccInput').value) || 39;
  var vacc = parseInt(document.getElementById('vaccInput').value) || 1000;
  var jitter = parseInt(document.getElementById('jitterInput').value) || 0;

  var payload = {
    latitude: lat,
    longitude: lon,
    altitude: altVal,
    horizontalAccuracy: hacc,
    verticalAccuracy: vacc,
    jitterRadius: jitter
  };

  fetch(SAVE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(r){
    btn.disabled = false;
    btn.textContent = t('save');
    if (r.ok || r.status === 200) {
      toast(t('saved_toast'));
      queryActive();
    } else {
      toast(t('write_failed'));
    }
  })
  .catch(function(err){
    console.error("Save Error:", err);
    btn.disabled = false;
    btn.textContent = t('save');
    toast(t('write_failed'));
  });
}

function restoreReal() {
  if (!confirm(t('clear_confirm'))) return;
  fetch(SAVE_API, { method: 'DELETE' })
    .then(function(){
      toast(t('restored'));
      queryActive();
    })
    .catch(function(){ toast(t('clear_failed')); });
}

function locateMe() {
  if (!navigator.geolocation) return toast(t('no_geo'));
  toast(t('getting_loc'));
  navigator.geolocation.getCurrentPosition(
    function(pos){
      setTarget(pos.coords.latitude, pos.coords.longitude);
      toast(t('got_loc'));
    },
    function(err){ toast((err.message || 'Location error')); },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function copyField(type, btn) {
  var val = '';
  if (type === 'lat') val = lat.toFixed(6);
  if (type === 'lon') val = lon.toFixed(6);
  if (type === 'alt') val = document.getElementById('altInput').value || '0';
  navigator.clipboard.writeText(val).then(function(){
    var orig = btn.textContent;
    btn.textContent = '✓';
    setTimeout(function(){ btn.textContent = orig; }, 1500);
  });
}

function copyParams(btn) {
  if (!selected) return toast(t('pick_first'));
  var altVal = document.getElementById('altInput').value || '0';
  var hacc = document.getElementById('haccInput').value || '39';
  var vacc = document.getElementById('vaccInput').value || '1000';
  var jitter = document.getElementById('jitterInput').value || '0';
  var str = 'lat=' + lat.toFixed(6) + '&lon=' + lon.toFixed(6) + '&alt=' + altVal + '&hacc=' + hacc + '&vacc=' + vacc + '&jitter=' + jitter;
  navigator.clipboard.writeText(str).then(function(){ toast('已复制参数'); });
}

function queryActive() {
  document.getElementById('activeValue').textContent = t('querying');
  document.getElementById('errorBanner').style.display = 'none';

  fetch(ACTIVE_API)
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data && data.latitude !== undefined) {
        document.getElementById('activeValue').innerHTML = 
          'Lat: ' + data.latitude.toFixed(6) + '<br>Lon: ' + data.longitude.toFixed(6) +
          '<br>Alt: ' + (data.altitude || 0) + 'm | Acc: ' + (data.horizontalAccuracy || 39) + 'm';
      } else {
        document.getElementById('activeValue').textContent = t('no_saved');
      }
    })
    .catch(function(err){
      console.warn("Query Active Failed:", err);
      document.getElementById('activeValue').textContent = t('query_failed');
      document.getElementById('errorBanner').style.display = 'block';
    });
}

function clearActive() {
  if (!confirm(t('clear_confirm'))) return;
  fetch(ACTIVE_API, { method: 'DELETE' })
    .then(function(){
      toast(t('dev_cleared'));
      queryActive();
    })
    .catch(function(){ toast(t('clear_failed')); });
}

function parseUrl() {
  var input = document.getElementById('urlInput').value.trim();
  if (!input) return toast(t('paste_first'));

  toast(t('parsing'));
  fetch(PARSE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if (data && data.latitude && data.longitude) {
      setTarget(data.latitude, data.longitude);
      toast('解析成功！');
    } else {
      toast(t('parse_failed'));
    }
  })
  .catch(function(){ toast(t('parse_failed')); });
}

function searchPlace() {
  var q = document.getElementById('searchInput').value.trim();
  if (!q) return toast(t('enter_place'));

  var resBox = document.getElementById('searchResults');
  resBox.innerHTML = '<div style="font-size:12px;color:var(--muted);text-align:center;padding:12px;">' + t('searching') + '</div>';

  fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(q))
    .then(function(r){ return r.json(); })
    .then(function(list){
      resBox.innerHTML = '';
      if (!list || list.length === 0) {
        resBox.innerHTML = '<div style="font-size:12px;color:var(--muted);text-align:center;padding:12px;">无搜索结果</div>';
        return;
      }
      list.slice(0, 5).forEach(function(item){
        var div = document.createElement('div');
        div.className = 'search-item';
        div.innerHTML = '<div class="si-name">' + item.display_name.split(',')[0] + '</div><div class="si-sub">' + item.display_name + '</div>';
        div.onclick = function(){
          setTarget(parseFloat(item.lat), parseFloat(item.lon));
          resBox.innerHTML = '';
        };
        resBox.appendChild(div);
      });
    })
    .catch(function(){
      resBox.innerHTML = '<div style="font-size:12px;color:var(--red);text-align:center;padding:12px;">' + t('search_failed') + '</div>';
    });
}

function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch(e) { return []; }
}
function saveFavs(list) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch(e) {}
}
function renderFavs() {
  var list = getFavs();
  var box = document.getElementById('favList');
  var clearBtn = document.getElementById('clearAllBtn');
  clearBtn.style.display = list.length ? 'block' : 'none';
  if (!list.length) {
    box.innerHTML = '<div class="fav-empty">' + t('fav_empty') + '</div>';
    return;
  }
  box.innerHTML = '';
  list.forEach(function(item, idx){
    var el = document.createElement('div');
    el.className = 'fav-item';
    el.innerHTML = '<div class="fav-info" onclick="loadFav(' + idx + ')"><div class="fav-name">' + esc(item.name) + '</div><div class="fav-coords">' + item.lat.toFixed(6) + ', ' + item.lon.toFixed(6) + '</div></div><button class="fav-del" onclick="delFav(event, ' + idx + ')">×</button>';
    box.appendChild(el);
  });
}
function loadFav(idx) {
  var list = getFavs();
  if (list[idx]) setTarget(list[idx].lat, list[idx].lon);
}
function delFav(e, idx) {
  e.stopPropagation();
  var list = getFavs();
  list.splice(idx, 1);
  saveFavs(list);
  renderFavs();
}
function clearAllFav() {
  if (!confirm(t('clear_fav_confirm'))) return;
  saveFavs([]);
  renderFavs();
  toast(t('all_cleared'));
}
function addFav() {
  if (!selected) return toast(t('pick_first'));
  document.getElementById('favModalCoords').textContent = lat.toFixed(6) + ', ' + lon.toFixed(6);
  document.getElementById('favNameInput').value = '';
  document.getElementById('favModal').classList.add('show');
  setTimeout(function(){ document.getElementById('favNameInput').focus(); }, 100);
}
function closeFavModal() {
  document.getElementById('favModal').classList.remove('show');
}
function confirmFav() {
  var name = document.getElementById('favNameInput').value.trim() || ('Loc ' + lat.toFixed(4) + ', ' + lon.toFixed(4));
  var list = getFavs();
  list.unshift({ name: name, lat: lat, lon: lon });
  saveFavs(list);
  renderFavs();
  closeFavModal();
  toast('已收藏');
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

applyI18n();
queryActive();
</script>
</body>
</html>`;
}
