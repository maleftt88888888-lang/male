export function getLandingHtml(origin) {
  const baseUrl = origin && origin !== 'undefined' ? origin : '';
  const fullModuleUrl = baseUrl + '/ios-location-spoofer.sgmodule';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>中国大陆微信LLME-love可乐加糖</title>
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

.app-icon {
  width:68px; height:68px; border-radius:18px;
  background:linear-gradient(135deg, #2563eb, #1d4ed8);
  display:inline-flex; align-items:center; justify-content:center;
  margin-bottom:14px; box-shadow:0 8px 24px rgba(37,99,235,.35);
  border:1px solid rgba(255,255,255,.15);
}
.app-icon svg { width:36px; height:36px; fill:#ffffff; }

.header h1 { font-size:22px; font-weight:800; color:var(--txt); letter-spacing:-.3px; }
.header p { font-size:13px; color:var(--muted); margin-top:6px; }

.section-title {
  font-size:16px; font-weight:700; color:var(--txt); margin-bottom:6px;
  display:flex; align-items:center; gap:8px;
}
.section-title::before {
  content:''; display:inline-block; width:4px; height:16px;
  background:var(--green); border-radius:2px;
}
.section-desc { font-size:13px; color:var(--muted); margin-bottom:14px; }

.card {
  background:linear-gradient(180deg,rgba(25,30,40,.72),rgba(18,22,29,.72));
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
  border:1px solid var(--line); border-radius:18px; padding:20px;
  margin-bottom:16px; box-shadow:0 8px 28px rgba(0,0,0,.34);
}

.notice-card {
  background:linear-gradient(180deg,rgba(25,30,40,.72),rgba(18,22,29,.72));
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
  border:1px solid var(--line); border-left:4px solid var(--cyan);
  border-radius:14px; padding:16px; font-size:13px; line-height:1.6;
  color:var(--muted); margin-bottom:20px;
}

.btn-primary {
  display:block; width:100%; padding:14px; text-align:center;
  background:linear-gradient(135deg,var(--cyan),var(--cyan2));
  color:#022a2d; font-size:15px; font-weight:700; text-decoration:none;
  border-radius:12px; box-shadow:0 6px 18px rgba(23,195,207,.28);
  transition:all .15s;
}
.btn-primary:active { filter:brightness(1.12); transform:scale(.98); }

.btn-green-map {
  display:block; width:100%; padding:14px; text-align:center;
  background:linear-gradient(135deg, #10b981, #059669);
  color:#fff; font-size:15px; font-weight:700; text-decoration:none;
  border-radius:12px; box-shadow:0 6px 18px rgba(16,185,129,.28);
  transition:all .15s; margin-bottom:24px;
}
.btn-green-map:active { filter:brightness(1.12); transform:scale(.98); }
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <div class="app-icon">
      <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
    </div>
    <h1>中国大陆微信LLME-love可乐加糖</h1>
    <p>模块管理 & 地图选点面板</p>
  </div>

  <a class="btn-green-map" href="/picker">🗺️ 进入选点网页</a>

  <div class="section-title">安装模块</div>
  <div class="section-desc">选你的代理客户端，点「一键导入」直接装；或复制手动添加。</div>

  <div class="notice-card">
    📍 生效前提：① shadowrocket（开关/引擎打开）；② 开启 HTTPS 解密 (MITM) 并信任证书；③ 装好对应客户端的模块。之后打开选点页选位置、点「储存到设备」即可生效。iOS 26+ 切换后可能需重启一次设备清缓存。
  </div>

  <div class="card">
    <a class="btn-primary" id="srBtn" href="shadowrocket://config/add/remote?url=${encodeURIComponent(fullModuleUrl)}">一键导入 Shadowrocket</a>
  </div>
</div>
</body>
</html>`;
}
