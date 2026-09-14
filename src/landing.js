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

/* 完全重构为深色暗黑卡片风格的微信联系名片 */
.wx-card-dark {
  background: linear-gradient(180deg, rgba(25,30,40,.82), rgba(18,22,29,.85));
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border: 1px solid var(--line);
  box-shadow: 0 12px 36px rgba(0,0,0,.45);
  border-radius: 20px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.wx-card-dark::before {
  content: '';
  position: absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg, transparent, rgba(34,197,94,.4), transparent);
}
.wx-profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.wx-avatar-pic {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,.15);
  box-shadow: 0 4px 12px rgba(0,0,0,.3);
}
.wx-profile-meta h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--txt);
  line-height: 1.3;
}
.wx-profile-meta p {
  font-size: 12px;
  color: var(--muted);
  margin-top: 3px;
}

/* 保证扫码成功的纯白正方形背景外框（带科技微光边框约束） */
.wx-qr-box {
  background: #ffffff;
  padding: 14px;
  border-radius: 16px;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08);
  margin-bottom: 16px;
}
.wx-qr-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.wx-tips {
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 0.3px;
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

  <!-- 放置在首页靠后高频触达的联系位置 -->
  <div class="section-title" style="margin-top:28px;">交流与支持</div>
  <div class="wx-card-dark">
    <div class="wx-profile-header">
      <!-- 建议替换为你实际导出的头像图片路径或 Base64 -->
      <img class="wx-avatar-pic" src="/wechat-avatar.jpg" alt="可乐加糖头像" onerror="this.style.background='linear-gradient(135deg,#2563eb,#1d4ed8)'">
      <div class="wx-profile-meta">
        <h3>可乐加糖</h3>
        <p>浙江 杭州</p>
      </div>
    </div>
    
    <div class="wx-qr-box">
      <!-- 保持原绿码二维码结构与中心绿色微信图标，内联白框防色反差导致扫不出 -->
      <img src="/wechat-qrcode.png" alt="微信加好友二维码" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'color:#333;font-size:12px;text-align:center\\'>请放真实二维码 src</span>'">
    </div>
    
    <div class="wx-tips">扫二维码，添加我为朋友。</div>
  </div>
</div>
</body>
</html>`;
}
