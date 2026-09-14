export function getLandingHtml(origin) {
  const srUrl = origin + '/ios-location-spoofer.sgmodule';

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
  transition:all .15s; margin-bottom:12px;
}
.btn-primary:active { filter:brightness(1.12); transform:scale(.98); }

.copy-box { display:flex; gap:8px; align-items:center; }
.copy-box input {
  flex:1; padding:10px 12px; background:var(--inset); border:1px solid var(--line);
  border-radius:10px; font-family:"SF Mono",ui-monospace,monospace; font-size:12px;
  color:var(--mono); outline:none; min-width:0;
}
.btn-copy {
  padding:10px 16px; background:var(--card2); border:1px solid var(--line);
  color:var(--txt); font-size:13px; font-weight:600; border-radius:10px; cursor:pointer;
}
.btn-copy:active { background:#2a3140; }

.btn-map {
  display:block; width:100%; padding:14px; text-align:center;
  background:var(--card2); border:1px solid var(--line);
  color:var(--txt); font-size:15px; font-weight:700; text-decoration:none;
  border-radius:12px; transition:all .15s;
}
.btn-map:active { background:#2a3140; transform:scale(.98); }

.toast {
  position:fixed; top:20px; left:50%; transform:translateX(-50%);
  background:rgba(8,10,14,.92); border:1px solid var(--line); color:#fff;
  padding:10px 20px; border-radius:20px; font-size:13px; opacity:0;
  transition:opacity .3s; pointer-events:none; z-index:9999;
}
.toast.show { opacity:1; }
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <h1>iOS Location Spoofer</h1>
    <p>模块管理 & 地图选点面板</p>
  </div>

  <div class="card">
    <a class="btn-primary" href="shadowrocket://config/add/remote?url=${encodeURIComponent(srUrl)}">一键导入 Shadowrocket</a>
    <div class="copy-box">
      <input id="srUrl" value="${srUrl}" readonly />
      <button class="btn-copy" onclick="copyText('srUrl', this)">复制</button>
    </div>
  </div>

  <div style="margin-top:20px;">
    <a class="btn-map" href="/page">打开地图选点界面 →</a>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
function copyText(id, btn) {
  var input = document.getElementById(id);
  input.select();
  navigator.clipboard.writeText(input.value).then(function() {
    var orig = btn.textContent;
    btn.textContent = '已复制';
    setTimeout(function() { btn.textContent = orig; }, 1500);
  });
}
</script>
</body>
</html>`;
}
