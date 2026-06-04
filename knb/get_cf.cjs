#!/usr/bin/env node
/* Launch headless Chrome, clear the Cloudflare challenge on cassa.site, then
 * dump the cf_clearance cookie + the exact User-Agent so curl (same IP+UA) can
 * reuse the clearance. Writes knb/cf_cookie.txt and knb/cf_ua.txt. */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const PORT = 9222, PROFILE = '/tmp/cf-chrome-prof';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, nextId = 1; const pending = new Map();
function send(method, params, sessionId) {
  const id = nextId++; const msg = { id, method, params: params || {} };
  if (sessionId) msg.sessionId = sessionId;
  ws.send(JSON.stringify(msg));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
}
(async () => {
  const chrome = spawn('google-chrome-stable', ['--headless=new','--disable-gpu','--no-first-run',
    '--no-default-browser-check',`--user-data-dir=${PROFILE}`,`--remote-debugging-port=${PORT}`,'about:blank'],
    { stdio: 'ignore' });
  let wsUrl = null;
  for (let i=0;i<40;i++){ try{ const v=JSON.parse(execSync(`curl -s http://localhost:${PORT}/json/version`).toString()); wsUrl=v.webSocketDebuggerUrl; if(wsUrl)break; }catch{} await sleep(500); }
  if(!wsUrl){ console.error('no devtools'); chrome.kill(); process.exit(1); }
  ws = new WebSocket(wsUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej;});
  ws.onmessage=(ev)=>{ const m=JSON.parse(ev.data); if(m.id&&pending.has(m.id)){ const{res,rej}=pending.get(m.id); pending.delete(m.id); m.error?rej(new Error(m.error.message)):res(m.result);} };
  const { targetId } = await send('Target.createTarget', { url: 'https://cassa.site/' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);
  let ok=false;
  for(let i=0;i<40;i++){ await sleep(1000);
    const r=await send('Runtime.evaluate',{expression:'document.title',returnByValue:true},sessionId);
    const t=r.result&&r.result.value; if(t&&!/just a moment/i.test(t)){ok=true;console.error('cleared:',t);break;} }
  if(!ok){ console.error('challenge not cleared'); ws.close(); chrome.kill(); process.exit(2); }
  const ua=(await send('Runtime.evaluate',{expression:'navigator.userAgent',returnByValue:true},sessionId)).result.value;
  const { cookies } = await send('Network.getCookies', { urls: ['https://cassa.site/'] }, sessionId);
  const cf = cookies.filter(c=>/^cf_clearance$|^__cf_bm$/.test(c.name)).map(c=>`${c.name}=${c.value}`).join('; ');
  fs.writeFileSync(path.join(__dirname,'cf_cookie.txt'), cf);
  fs.writeFileSync(path.join(__dirname,'cf_ua.txt'), ua);
  console.error('UA:', ua);
  console.error('cookie names:', cookies.map(c=>c.name).join(','));
  ws.close(); chrome.kill(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
