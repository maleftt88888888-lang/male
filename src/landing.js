export function getLandingHtml(origin) {
  const baseUrl = origin && origin !== 'undefined' ? origin : '';
  const fullModuleUrl = baseUrl + '/ios-location-spoofer.sgmodule';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>中国大陆微信LLME-love</title>
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

/* 微信适配深色名片样式 */
.wx-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.wx-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  width: 100%;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}
.wx-avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,.1);
  background: #2563eb;
}
.wx-info h3 { font-size: 15px; font-weight: 700; color: var(--txt); }
.wx-info p { font-size: 12px; color: var(--muted); margin-top: 2px; }

.wx-qrcode-box {
  width: 190px;
  height: 190px;
  background: #ffffff;
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
  position: relative;
  margin-bottom: 14px;
}
.wx-qrcode-box svg {
  width: 100%;
  height: 100%;
}
.wx-logo-badge {
  position: absolute;
  width: 36px;
  height: 36px;
  background: #07c160;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  border: 2px solid #fff;
}
.wx-logo-badge svg { width: 22px; height: 22px; fill: #fff; }
.wx-footer-tip {
  font-size: 13px;
  color: var(--muted);
}
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <div class="app-icon">
      <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
    </div>
    <h1>中国大陆微信LLME-love</h1>
    <p>模块管理 & 地图选点面板</p>
  </div>

  <a class="btn-green-map" href="/page">🗺️ 进入选点网页</a>

  <div class="section-title">安装模块</div>
  <div class="section-desc">选你的代理客户端，点「一键导入」直接装；或复制手动添加。</div>

  <div class="notice-card">
    📍 生效前提：① 代理 App 已连接（开关/引擎打开、非「直连」模式）；② 开启 HTTPS 解密 (MITM) 并信任证书；③ 装好对应客户端的模块。之后打开选点页选位置、点「储存到设备」即可生效。iOS 26+ 切换后可能需重启一次设备清缓存。
  </div>

  <div class="card">
    <a class="btn-primary" id="srBtn" href="shadowrocket://config/add/remote?url=${encodeURIComponent(fullModuleUrl)}">一键导入 Shadowrocket</a>
  </div>

  <!-- 适配整体暗黑/青蓝配色的微信联系卡片 -->
  <div class="section-title" style="margin-top:24px;">联系与支持</div>
  <div class="card wx-card">
    <div class="wx-header">
      <img class="wx-avatar" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231d4ed8'/><circle cx='50' cy='38' r='18' fill='%23fff'/><path d='M20 85 C20 65, 80 65, 80 85 Z' fill='%23fff'/></svg>" alt="头像">
      <div class="wx-info">
        <h3>可乐加糖</h3>
        <p>浙江 杭州</p>
      </div>
    </div>
    
    <div class="wx-qrcode-box">
      <!-- 几何化替代原图复杂黑白码，实际可替换为你的二维码图片或SVG -->
      <svg viewBox="0 0 100 100" shape-rendering="crispEdges">
        <rect width="100" height="100" fill="#fff"/>
        <path d="M5,5 h30 v30 h-30 z M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="#000"/>
        <path d="M65,5 h30 v30 h-30 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="#000"/>
        <path d="M5,65 h30 v30 h-30 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="#000"/>
        <path d="M40,10 h5 v5 h-5 z M55,5 h5 v5 h-5 z M45,20 h10 v5 h-10 z M10,40 h5 v10 h-5 z M25,45 h5 v5 h-5 z M40,40 h20 v20 h-20 z M65,40 h5 v10 h-5 z M80,50 h10 v5 h-10 z M40,70 h5 v5 h-5 z M55,65 h10 v5 h-10 z M70,75 h15 v15 h-15 z" fill="#000"/>
      </svg>
      <div class="wx-logo-badge">
        <svg viewBox="0 0 24 24"><path d="M8.5,13.5A1.5,1.5 0 0,1 7,12A1.5,1.5 0 0,1 8.5,10.5A1.5,1.5 0 0,1 10,12A1.5,1.5 0 0,1 8.5,13.5M15.5,13.5A1.5,1.5 0 0,1 14,12A1.5,1.5 0 0,1 15.5,10.5A1.5,1.5 0 0,1 17,12A1.5,1.5 0 0,1 15.5,13.5M12,2A10,10 0 0,0 2,12C2,14.66 3.05,17.06 4.76,18.82L3.5,22L6.87,20.93C8.42,21.6 10.15,22 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
      </div>
    </div>
    
    <div class="wx-footer-tip">扫二维码，添加我为朋友。</div>
  </div>
</div>
</body>
</html>`;
}
