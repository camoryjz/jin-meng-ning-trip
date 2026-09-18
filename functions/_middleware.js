const PASSWORD_HASH = "8845ad40eee147e8a69d384c5e7b5a1a7b1abea94e2df856717e8c607d1a02c4";
const COOKIE_VALUE = "jmn-v1-a83e26f9c4b71d05";
const COOKIE_NAME = "jmn_trip_access";
const FOURTEEN_DAYS = 60 * 60 * 24 * 14;

function hex(bytes) {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256(value) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}
function hasAccess(request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.split(";").some((part) => part.trim() === COOKIE_NAME + "=" + COOKIE_VALUE);
}
function gateHtml(target = "/", error = "") {
  const safeTarget = String(target || "/").startsWith("/") ? String(target) : "/";
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light"><title>打开这次旅程</title><style>
  :root{font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:#102c35;background:#f6f7f3}
  *{box-sizing:border-box}body{margin:0;min-height:100vh;background:linear-gradient(180deg,#fbfcf9 0%,#f4f7f3 55%,#edf4ef 100%);display:grid;place-items:center;padding:30px 18px}
  .gate{width:min(100%,720px)}.eyebrow{font:700 13px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;color:#287887;margin-bottom:54px}
  .hero{margin-bottom:42px}.hero small{display:block;color:#237d84;font:800 13px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;margin-bottom:16px}
  h1{font-size:clamp(42px,8vw,76px);line-height:1.04;letter-spacing:-.055em;margin:0;color:#0d2730}p{font-size:18px;color:#596b68;margin:18px 0 0}
  .card{overflow:hidden;border-radius:28px;background:#fff;box-shadow:0 18px 55px rgba(35,68,61,.12);border:1px solid #e0e9e4}
  .card-head{padding:30px 34px;background:#12303b;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px}.card-head strong{font-size:27px}.card-head span{font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;color:#c7dbdc}
  .body{padding:32px 34px 36px}.body>p{margin:0 0 26px;font-size:16px}label{display:block;font-weight:800;font-size:14px;margin-bottom:10px}
  .field{display:flex;align-items:center;border:1.5px solid #91a8a3;border-radius:17px;background:#fff;overflow:hidden}.field input{width:100%;border:0;outline:0;padding:18px 20px;font-size:22px;letter-spacing:.28em}.field button{width:62px;align-self:stretch;border:0;background:#fff;font-size:23px;cursor:pointer;color:#274740}
  .remember{display:flex;align-items:center;gap:10px;margin:22px 0;font-size:14px;color:#526763}.remember input{width:20px;height:20px;accent-color:#25899a}
  .submit{width:100%;min-height:58px;border:0;border-radius:15px;background:#258b9b;color:#fff;font-weight:850;font-size:17px;cursor:pointer}.error{margin:0 0 14px;padding:10px 12px;border-radius:12px;background:#fff0ed;color:#b84b3d;font-size:13px}
  .foot{border-top:1px solid #e4ebe7;margin-top:26px;padding-top:18px;color:#788884;font-size:12px}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#6a8c72;margin-right:10px}
  @media(max-width:560px){body{padding:24px 16px;align-items:start}.eyebrow{margin:24px 0 52px}.hero{margin-bottom:34px}h1{font-size:46px}.card{border-radius:24px}.card-head,.body{padding-left:24px;padding-right:24px}.card-head strong{font-size:23px}.field input{font-size:19px}}
  </style></head><body><main class="gate"><div class="eyebrow">TRAVEL PLAN · PRIVATE</div><section class="hero"><small>PRIVATE JOURNEY</small><h1>打开这次旅程</h1><p>这个行程仅向同行者开放。</p></section><section class="card"><div class="card-head"><strong>仅限同行者</strong><span>SECURE · LOCKED</span></div><div class="body"><p>请输入共享密码继续。</p>${error ? '<div class="error">'+error+'</div>' : ''}<form method="post" action="/__unlock"><input type="hidden" name="target" value="${safeTarget.replace(/"/g,"&quot;")}"><label for="pw">访问密码</label><div class="field"><input id="pw" name="password" type="password" autocomplete="current-password" required autofocus><button type="button" aria-label="显示或隐藏密码" onclick="const i=document.getElementById('pw');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'◉':'◎'">◉</button></div><label class="remember"><input type="checkbox" name="remember" value="1" checked>在这台设备上保持访问 14 天</label><button class="submit" type="submit">进入旅程 →</button></form><div class="foot"><span class="dot"></span>PRIVATE ACCESS · TRAVEL PLAN</div></div></section></main></body></html>`;
}
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname === "/__unlock" && request.method === "POST") {
    const form = await request.formData();
    const password = String(form.get("password") || "");
    const target = String(form.get("target") || "/");
    const remember = String(form.get("remember") || "") === "1";
    if ((await sha256(password)) === PASSWORD_HASH) {
      const parts = [
        COOKIE_NAME + "=" + COOKIE_VALUE,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax"
      ];
      if (remember) parts.push("Max-Age=" + FOURTEEN_DAYS);
      return new Response(null, {
        status: 303,
        headers: {
          "Location": target.startsWith("/") ? target : "/",
          "Set-Cookie": parts.join("; ")
        }
      });
    }
    return new Response(gateHtml(target, "密码不正确，请重新输入。"), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
    });
  }

  if (hasAccess(request)) return context.next();

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Unauthorized", { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  return new Response(gateHtml(url.pathname + url.search), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}
