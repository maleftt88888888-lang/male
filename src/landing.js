export function getLandingHtml(origin) {
  const baseUrl = origin && origin !== 'undefined' ? origin : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>iOS Location Spoofer</title>
<meta name="theme-color" content="#0a0c11">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
:root {
  --bg:#0a0c11; --card:#12161d; --card2:#191e28; --line:#242b38; --inset:rgba(255,255,255,.045);
  --cyan:#17c3cf; --cyan2:#0e97a1; --green:#22c55e; --txt:#eef2f8; --muted:#8a93a5; --mono:#7fe3ea;
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
  padding:20px 16px;
}
.container { max-width:540px; margin:0 auto; }
.header { text-align:center; margin-bottom:24px; padding-top:12px; }
.header h1 { font-size:22px; font-weight:800; color:var(--txt); letter-spacing:-.3px; }
.header p { font-size:13px; color:var(--muted); margin-top:6px; }

.card {
  background:linear-gradient(180deg,rgba(25,30,40,.72),rgba(18,22,29,.72));
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
  border:1px solid var(--line); border-radius:18px; padding:20px;
  margin-bottom:16px; box-shadow:0 8px 28px rgba(0,0,0,.34);
}

.btn-primary {
  display:block; width:100%; padding:14px; text-align:center;
  background:linear-gradient(135deg,var(--cyan),var(--cyan2));
  color:#022a2d; font-size:15px; font-weight:700; text-decoration:none;
  border-radius:12px; box-shadow:0 6px 18px rgba(23,195,207,.28);
  transition:all .15s;
}
.btn-primary:active { filter:brightness(1.12); transform:scale(.98); }

.btn-map {
  display:block; width:100%; padding:14px; text-align:center;
  background:var(--card2); border:1px solid var(--line);
  color:var(--txt); font-size:15px; font-weight:700; text-decoration:none;
  border-radius:12px; transition:all .15s;
}
.btn-map:active { background:#2a3140; transform:scale(.98); }
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <h1>iOS Location Spoofer</h1>
    <p>模块管理 & 地图选点面板</p>
  </div>

  <div class="card">
    <a class="btn-primary" id="btnSurge" href="#">一键导入 Surge</a>
  </div>

  <div class="card">
    <a class="btn-primary" id="btnSr" href="#">一键导入 Shadowrocket</a>
  </div>

  <div class="card">
    <a class="btn-primary" id="btnEgern" href="#">一键导入 Egern</a>
  </div>

  <div class="card">
    <a class="btn-primary" id="btnLoon" href="#">一键导入 Loon</a>
  </div>

  <div class="card">
    <a class="btn-primary" id="btnStash" href="#">一键导入 Stash</a>
  </div>

  <div class="card">
    <a class="btn-primary" id="btnQX" href="#">一键导入 Quantumult X</a>
  </div>

  <div style="margin-top:20px;">
    <a class="btn-map" href="/page">打开地图选点界面 →</a>
  </div>
</div>

<script>
var base = "${baseUrl}" || window.location.origin;
var sgUrl = base + '/ios-location-spoofer.sgmodule';
var lnUrl = base + '/ios-location-spoofer.lnplugin';
var stUrl = base + '/ios-location-spoofer.stoverride';
var qxUrl = base + '/ios-location-spoofer.snippet';

document.getElementById('btnSurge').href = 'surge:///install-config?url=' + encodeURIComponent(sgUrl);
document.getElementById('btnSr').href = 'shadowrocket://config/add/remote?url=' + encodeURIComponent(sgUrl);
document.getElementById('btnEgern').href = 'egern://import?url=' + encodeURIComponent(sgUrl);
document.getElementById('btnLoon').href = 'loon://import?plugin=' + encodeURIComponent(lnUrl);
document.getElementById('btnStash').href = 'stash://install-override?url=' + encodeURIComponent(stUrl);
document.getElementById('btnQX').href = 'quantumult-x://exec?type=snippet&url=' + encodeURIComponent(qxUrl);
</script>
</body>
</html>`;
}
