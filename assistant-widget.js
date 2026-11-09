(() => {
  const isPage = document.currentScript?.dataset.mode === "page" || location.pathname.startsWith("/assistant");
  const root = document.getElementById("ri-assistant-root") || document.body.appendChild(document.createElement("div"));
  root.id = "ri-assistant-root";
  const css = `
  #ri-assistant-root{font-family:Inter,Arial,sans-serif;color:#eaf2ff}
  #ri-assistant-root *{box-sizing:border-box}
  .ri-launch{position:fixed;right:20px;bottom:20px;z-index:99998;border:0;border-radius:999px;background:#20c997;color:#06251f;padding:15px 20px;font-weight:800;box-shadow:0 8px 30px #0005;cursor:pointer}
  .ri-shell{position:fixed;right:20px;bottom:82px;width:min(390px,calc(100vw - 28px));height:min(600px,calc(100dvh - 110px));z-index:99999;background:#101c31;border:1px solid #29415f;border-radius:18px;box-shadow:0 20px 60px #0008;display:none;overflow:hidden;flex-direction:column}
  .ri-shell.ri-open{display:flex}
  .ri-head{background:#142742;padding:16px 18px;border-bottom:1px solid #29415f;display:flex;justify-content:space-between;align-items:center}
  .ri-head strong{display:block;font-size:15px}.ri-head small{color:#a9bad0;font-size:12px}
  .ri-close{border:0;background:transparent;color:#fff;font-size:25px;cursor:pointer}
  .ri-disclaimer{font-size:11px;line-height:1.45;color:#a9bad0;padding:9px 14px;background:#0c1728}
  .ri-log{padding:14px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:10px}
  .ri-msg{max-width:88%;padding:10px 12px;border-radius:13px;font-size:13px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
  .ri-bot{align-self:flex-start;background:#1b304c;color:#edf5ff;border-bottom-left-radius:4px}
  .ri-user{align-self:flex-end;background:#176d5a;color:white;border-bottom-right-radius:4px}
  .ri-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px}
  .ri-quick button{background:#172c47;color:#dceaff;border:1px solid #36516f;border-radius:20px;padding:7px 10px;font-size:11px;cursor:pointer}
  .ri-form{display:flex;gap:8px;padding:12px;border-top:1px solid #29415f}
  .ri-form textarea{resize:none;min-height:42px;max-height:100px;flex:1;border-radius:10px;border:1px solid #39536f;background:#0b1728;color:#fff;padding:10px;font:inherit;font-size:13px}
  .ri-send{border:0;border-radius:10px;background:#20c997;color:#06251f;font-weight:800;padding:0 15px;cursor:pointer}
  .ri-links{padding:0 12px 12px;font-size:12px;display:flex;justify-content:space-between;gap:10px}
  .ri-links a{color:#67e3c1;text-decoration:none}
  .ri-whatsapp-action{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:10px;padding:13px 18px;min-height:46px;border-radius:10px;background:#20c997;color:#06251f!important;font-size:14px;font-weight:800;text-decoration:none!important;box-shadow:0 5px 18px #0003}
  .ri-whatsapp-action:hover{filter:brightness(1.06)}
  .ri-whatsapp-action svg{width:19px;height:19px;fill:currentColor;flex:none}
  .ri-page{max-width:900px;margin:40px auto;padding:0 18px}
  .ri-page .ri-shell{position:relative;right:auto;bottom:auto;width:100%;height:680px;max-height:75vh;display:flex;margin-top:22px}
  .ri-page .ri-launch{display:none}
  @media(max-width:520px){.ri-shell{right:10px;bottom:76px;width:calc(100vw - 20px);height:min(620px,calc(100dvh - 90px))}.ri-launch{right:12px;bottom:12px}.ri-page{margin:22px auto}.ri-page .ri-shell{height:70vh}}
  `;
  const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
  if(isPage) root.classList.add("ri-page");
  root.innerHTML = `
    <button class="ri-launch" type="button" aria-label="Open Removal Inspector assistant">Ask our AI assistant</button>
    <section class="ri-shell" aria-label="Removal Inspector AI assistant">
      <header class="ri-head"><div><strong>Removal Inspector Assistant</strong><small>Credit-profile education · English · isiZulu · Afrikaans</small></div><button class="ri-close" type="button" aria-label="Close">×</button></header>
      <div class="ri-disclaimer">Automated educational guidance only — not legal or debt-counselling advice. No guaranteed removals. Please do not share ID numbers, account numbers or credit reports.</div>
      <div class="ri-log" aria-live="polite"><div class="ri-msg ri-bot">Welcome. I can help you understand a credit-profile issue and explain the relevant DIY guidance. What is happening with your credit profile?</div></div>
      <div class="ri-quick">
        <button type="button" data-prompt="I have finished paying my debts but I am still under debt review. What should I do?">Still under debt review</button>
        <button type="button" data-prompt="I paid an account but it still shows as adverse on my credit profile.">Paid account still adverse</button>
        <button type="button" data-prompt="I want to understand an old debt and whether it may be prescribed.">Old debt</button>
        <button type="button" data-prompt="I have a judgment showing on my credit profile. What are my options?">Judgment</button>
      </div>
      <form class="ri-form"><textarea rows="1" maxlength="1800" placeholder="Type your question…" aria-label="Your question"></textarea><button class="ri-send" type="submit">Send</button></form>
      <div class="ri-links"><a href="https://wa.me/27757931848" target="_blank" rel="noopener">Speak to human support on WhatsApp</a><a href="/assistant/">Full assistant page</a></div>
    </section>`;
  const shell=root.querySelector(".ri-shell"), launch=root.querySelector(".ri-launch"), log=root.querySelector(".ri-log"), form=root.querySelector("form"), input=root.querySelector("textarea");
  let riConsent=localStorage.getItem("ri_analytics_consent")==="yes";
  let riSession=localStorage.getItem("ri_analytics_session");
  if(!riSession){riSession=(crypto.randomUUID?crypto.randomUUID():("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,x=>{const r=Math.random()*16|0;return(x==="x"?r:(r&3|8)).toString(16)})));localStorage.setItem("ri_analytics_session",riSession);}
  const consentBox=document.createElement("div");
  consentBox.style.cssText="padding:10px 14px;background:#10243a;border-top:1px solid #29415f;font-size:11px;line-height:1.45;color:#c5d4e8";
  consentBox.innerHTML='<span>Help improve this assistant? You can allow anonymous usage statistics. No chat messages, ID numbers or credit-report details are stored.</span><div style="display:flex;gap:8px;margin-top:8px"><button type="button" data-ri-consent="yes" style="background:#20c997;color:#06251f;border:0;border-radius:7px;padding:6px 10px;font-weight:700">Allow</button><button type="button" data-ri-consent="no" style="background:#243b56;color:#fff;border:0;border-radius:7px;padding:6px 10px">No thanks</button></div>';
  shell.insertBefore(consentBox,shell.querySelector(".ri-log"));
  function setRiConsent(value){riConsent=value;localStorage.setItem("ri_analytics_consent",value?"yes":"no");consentBox.innerHTML=value?"Anonymous analytics enabled. No chat content is stored.":"Anonymous analytics disabled. You can still use the assistant normally.";}
  consentBox.querySelector('[data-ri-consent="yes"]').addEventListener("click",()=>setRiConsent(true));
  consentBox.querySelector('[data-ri-consent="no"]').addEventListener("click",()=>setRiConsent(false));

  const history=[];
  if(isPage){const title=document.createElement("div");title.innerHTML='<h1 style="color:#eaf2ff;font-size:clamp(28px,5vw,42px);margin:0 0 8px">Removal Inspector AI Assistant</h1><p style="color:#a9bad0;margin:0">Get clear, practical guidance about common South African credit-profile issues.</p>';root.prepend(title);shell.classList.add("ri-open");}
  launch.addEventListener("click",()=>{ window.location.href="/assistant/"; });
  root.querySelector(".ri-close").addEventListener("click",()=>shell.classList.remove("ri-open"));
  function add(text,who){const el=document.createElement("div");el.className="ri-msg "+(who==="user"?"ri-user":"ri-bot");el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight;return el;}
  function renderAssistant(el,reply){
    const match=reply.match(/https:\/\/wa\.me\/27757931848(?:\?text=[^\s)<>]*)?/i);
    if(!match){el.textContent=reply;return;}
    const clean=reply.replace(match[0],"").replace(/[ \t]+\n/g,"\n").trim();
    el.textContent=clean;
    let url;
    try{url=new URL(match[0]);}catch{el.textContent=reply;return;}
    if(url.hostname!=="wa.me"||url.pathname!=="/27757931848"){el.textContent=reply;return;}
    const button=document.createElement("a");
    button.className="ri-whatsapp-action";button.href=url.href;button.target="_blank";button.rel="noopener noreferrer";
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.12 0C5.58 0 .25 5.32.25 11.86c0 2.09.55 4.13 1.59 5.93L.15 24l6.38-1.67a11.9 11.9 0 0 0 5.59 1.42h.01c6.54 0 11.87-5.32 11.87-11.86 0-3.17-1.24-6.15-3.48-8.41ZM12.13 21.7h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.78.99 1.01-3.69-.23-.38a9.83 9.83 0 0 1-1.51-5.18c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88Zm5.43-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35Z"/></svg><span>Continue on WhatsApp</span>';
    el.appendChild(document.createElement("br"));el.appendChild(button);
  }
  async function send(text){
    const clean=text.trim();if(!clean)return;
    add(clean,"user");history.push({role:"user",content:clean});input.value="";input.disabled=true;root.querySelector(".ri-send").disabled=true;
    const pending=add("Thinking…","assistant");
    try{
      const res=await fetch("/api/assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:history.slice(-10),analyticsConsent:riConsent,sessionId:riSession,language:(/\\b(ngiyabonga|ngicela|isikweletu|yini|ngifuna)\\b/i.test(history.map(x=>x.content).join(" "))?"zu":/\\b(dankie|kredietrekord|skuld|ek wil|wat het)\\b/i.test(history.map(x=>x.content).join(" "))?"af":"en")})});
      const data=await res.json();if(data.reply)renderAssistant(pending,data.reply);else pending.textContent=data.error||"Sorry, I could not respond. Please contact WhatsApp support.";
      if(data.reply)history.push({role:"assistant",content:data.reply});
    }catch(e){pending.textContent="The assistant is temporarily unavailable. Please contact WhatsApp support at 075 793 1848.";}
    finally{input.disabled=false;root.querySelector(".ri-send").disabled=false;input.focus();}
  }
  form.addEventListener("submit",e=>{e.preventDefault();send(input.value);});
  root.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.prompt)));
})();