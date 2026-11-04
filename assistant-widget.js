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
  const history=[];
  if(isPage){const title=document.createElement("div");title.innerHTML='<h1 style="color:#eaf2ff;font-size:clamp(28px,5vw,42px);margin:0 0 8px">Removal Inspector AI Assistant</h1><p style="color:#a9bad0;margin:0">Get clear, practical guidance about common South African credit-profile issues.</p>';root.prepend(title);shell.classList.add("ri-open");}
  launch.addEventListener("click",()=>shell.classList.toggle("ri-open"));
  root.querySelector(".ri-close").addEventListener("click",()=>shell.classList.remove("ri-open"));
  function add(text,who){const el=document.createElement("div");el.className="ri-msg "+(who==="user"?"ri-user":"ri-bot");el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight;return el;}
  async function send(text){
    const clean=text.trim();if(!clean)return;
    add(clean,"user");history.push({role:"user",content:clean});input.value="";input.disabled=true;root.querySelector(".ri-send").disabled=true;
    const pending=add("Thinking…","assistant");
    try{
      const res=await fetch("/api/assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:history.slice(-10)})});
      const data=await res.json();pending.textContent=data.reply||data.error||"Sorry, I could not respond. Please contact WhatsApp support.";
      if(data.reply)history.push({role:"assistant",content:data.reply});
    }catch(e){pending.textContent="The assistant is temporarily unavailable. Please contact WhatsApp support at 075 793 1848.";}
    finally{input.disabled=false;root.querySelector(".ri-send").disabled=false;input.focus();}
  }
  form.addEventListener("submit",e=>{e.preventDefault();send(input.value);});
  root.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.prompt)));
})();