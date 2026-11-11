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
  .ri-language{margin-top:8px;background:#0b1728;color:#eaf2ff;border:1px solid #49617d;border-radius:8px;padding:6px 9px;font-size:12px;max-width:150px}
  .ri-close{border:0;background:transparent;color:#fff;font-size:25px;cursor:pointer}
  .ri-disclaimer{font-size:11px;line-height:1.45;color:#a9bad0;padding:9px 14px;background:#0c1728}
  .ri-log{padding:16px;overflow-y:auto;overflow-x:hidden;flex:1 1 0;min-height:180px;display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
  .ri-msg{max-width:94%;width:fit-content;padding:13px 15px;border-radius:16px;font-size:16px;line-height:1.6;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;letter-spacing:.01em}
  .ri-bot{align-self:flex-start;background:#e9f5ee;color:#172b22;border-bottom-left-radius:5px}
  .ri-user{align-self:flex-end;background:#d9fdd3;color:#173b20;border-bottom-right-radius:5px}
  .ri-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px}
  .ri-quick button{background:#172c47;color:#dceaff;border:1px solid #36516f;border-radius:20px;padding:7px 10px;font-size:11px;cursor:pointer}
  .ri-form{display:flex;align-items:flex-end;gap:9px;padding:12px;border-top:1px solid #29415f;background:#101c31;flex:0 0 auto}
  .ri-form textarea{resize:vertical;min-height:48px;max-height:130px;flex:1;border-radius:18px;border:1px solid #aab8b0;background:#fff;color:#172b22;padding:12px 15px;font:inherit;font-size:16px;line-height:1.45}
  .ri-send{border:0;border-radius:18px;background:#20c997;color:#06251f;font-size:15px;font-weight:800;padding:0 17px;min-height:48px;cursor:pointer}
  .ri-links{padding:0 12px 12px;font-size:12px;display:flex;justify-content:space-between;gap:10px}
  .ri-links a{color:#67e3c1;text-decoration:none}
  .ri-whatsapp-action{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:10px;padding:13px 18px;min-height:46px;border-radius:10px;background:#20c997;color:#06251f!important;font-size:14px;font-weight:800;text-decoration:none!important;box-shadow:0 5px 18px #0003}
  .ri-whatsapp-action:hover{filter:brightness(1.06)}
  .ri-whatsapp-action svg{width:19px;height:19px;fill:currentColor;flex:none}
  .ri-page{max-width:900px;margin:40px auto;padding:0 18px}
  .ri-page .ri-shell{position:relative;right:auto;bottom:auto;width:100%;height:calc(100dvh - 170px);min-height:0;max-height:none;display:flex;margin-top:18px;overflow:hidden}
  .ri-page .ri-log{flex:1 1 0;min-height:0;overscroll-behavior:contain;scroll-behavior:smooth}
  .ri-page .ri-form,.ri-page .ri-links,.ri-page .ri-quick,.ri-page .ri-disclaimer,.ri-page .ri-head,.ri-page #ri-assistant-root>div,.ri-page .ri-shell>div:last-child{flex:0 0 auto;min-height:0}
  .ri-shell .ri-msg{white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;max-width:96%;font-size:16px;line-height:1.6}
  .ri-shell .ri-form textarea{min-width:0;width:100%;min-height:44px;max-height:120px;line-height:1.4;overflow-y:auto}
  .ri-shell .ri-send{min-height:44px;flex:0 0 auto}
  .ri-page .ri-launch{display:none}
  @media(max-width:520px){
    .ri-shell .ri-msg{max-width:98%;font-size:16px;line-height:1.6;padding:13px 14px}
    .ri-shell .ri-log{padding:12px;gap:11px}
    .ri-shell .ri-form textarea{font-size:16px;min-height:48px}
    .ri-shell .ri-quick button{font-size:12px;padding:8px 11px}
    .ri-shell{right:10px;bottom:76px;width:calc(100vw - 20px);height:calc(100dvh - 90px);max-height:calc(100dvh - 90px);border-radius:16px}
    .ri-launch{right:12px;bottom:12px}
    .ri-page{margin:12px auto;padding:0 10px}
    .ri-page .ri-shell{height:calc(100dvh - 145px);min-height:0;max-height:none;margin-top:12px}
    .ri-page .ri-log{padding:12px;min-height:0}
    .ri-page .ri-head{padding:12px}
    .ri-page .ri-disclaimer{padding:7px 10px}
    .ri-page .ri-quick{padding:0 10px 8px}
    .ri-page .ri-form{padding:9px}
    .ri-page .ri-links{padding:0 10px 9px;flex-wrap:wrap}
    .ri-page .ri-links a{font-size:11px}
    .ri-page .ri-page-title{display:block}
  }
  @media(max-height:560px){
    .ri-shell{height:calc(100dvh - 78px);bottom:68px}
    .ri-page .ri-shell{height:calc(100dvh - 110px);min-height:0}
    .ri-disclaimer{max-height:54px;overflow:auto}
  }
  `;
  const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
  if(isPage) root.classList.add("ri-page");
  root.innerHTML = `
    <button class="ri-launch" type="button" aria-label="Open Removal Inspector assistant">Ask our AI assistant</button>
    <section class="ri-shell" aria-label="Removal Inspector AI assistant">
      <header class="ri-head"><div><strong data-ri-title>Removal Inspector Assistant</strong><small data-ri-subtitle>Credit-profile education</small><label style="display:block;color:#c5d4e8;font-size:11px;margin-top:8px" for="ri-language">Choose your language</label><select class="ri-language" id="ri-language" aria-label="Choose your language"><option value="en">English</option><option value="zu">isiZulu</option><option value="af">Afrikaans</option></select></div><button class="ri-close" type="button" aria-label="Close">×</button></header>
      <div class="ri-disclaimer" data-ri-disclaimer>Automated educational guidance only — not legal or debt-counselling advice. No guaranteed removals. Please do not share ID numbers, account numbers or credit reports.</div>
      <div class="ri-log" aria-live="polite"><div class="ri-msg ri-bot" data-ri-welcome>Welcome. I can help you understand a credit-profile issue and explain the relevant DIY guidance. What is happening with your credit profile?</div></div>
      <div class="ri-quick">
        <button type="button" data-prompt="I have finished paying my debts but I am still under debt review. What should I do?" data-label-en="Still under debt review" data-label-zu="Ngisengaphansi kwe-debt review" data-label-af="Ek is steeds onder skuldhersiening">Still under debt review</button>
        <button type="button" data-prompt="I paid an account but it still shows as adverse on my credit profile." data-label-en="Paid account still adverse" data-label-zu="I-akhawunti ekhokhiwe isabonakala kabi" data-label-af="Betaalde rekening wys steeds negatief">Paid account still adverse</button>
        <button type="button" data-prompt="I want to understand an old debt and whether it may be prescribed." data-label-en="Old debt" data-label-zu="Isikweletu esidala" data-label-af="Ou skuld">Old debt</button>
        <button type="button" data-prompt="I have a judgment showing on my credit profile. What are my options?" data-label-en="Judgment" data-label-zu="Isinqumo senkantolo" data-label-af="Hofbevel">Judgment</button>
      </div>
      <form class="ri-form"><textarea rows="1" maxlength="1800" placeholder="Type your question…" aria-label="Your question"></textarea><button class="ri-send" type="submit">Send</button></form>
      <div class="ri-links"><a href="https://wa.me/27757931848" target="_blank" rel="noopener">Speak to human support on WhatsApp</a><a href="/assistant/">Full assistant page</a></div>
    </section>`;
  const shell=root.querySelector(".ri-shell"), launch=root.querySelector(".ri-launch"), log=root.querySelector(".ri-log"), form=root.querySelector("form"), input=root.querySelector("textarea");
  const languageSelect=root.querySelector("#ri-language");
  const uiText={
    en:{subtitle:"Credit-profile education",choose:"Choose your language",disclaimer:"Automated educational guidance only — not legal or debt-counselling advice. No guaranteed removals. Please do not share ID numbers, account numbers or credit reports.",welcome:"Welcome. I can help you understand a credit-profile issue and explain the relevant DIY guidance. What is happening with your credit profile?",placeholder:"Type your question…",send:"Send",whatsapp:"Speak to human support on WhatsApp",full:"Full assistant page"},
    zu:{subtitle:"Ulwazi lokuqonda umbiko wakho wesikweletu",choose:"Khetha ulimi lwakho",disclaimer:"Lolu usizo lolwazi kuphela oluzenzakalelayo — akusona iseluleko sezomthetho noma sokwelulekwa ngezikweletu. Asithembisi ukususwa kolwazi. Ungathumeli inombolo kamazisi, izinombolo zama-akhawunti noma umbiko wakho wesikweletu.",welcome:"Sawubona. Ngingakusiza uqonde inkinga ekumbiko wakho wesikweletu nezinyathelo ongazilandela. Yini ekukhathazayo ngombiko wakho wesikweletu?",placeholder:"Bhala umbuzo wakho…",send:"Thumela",whatsapp:"Khuluma nomuntu ku-WhatsApp",full:"Ikhasi lomsizi eligcwele"},
    af:{subtitle:"Opvoedkundige kredietrekordinligting",choose:"Kies jou taal",disclaimer:"Slegs outomatiese opvoedkundige leiding — nie regs- of skuldberadingsadvies nie. Geen verwydering word gewaarborg nie. Moet asseblief nie jou ID-nommer, rekeningnommers of kredietverslag deel nie.",welcome:"Welkom. Ek kan jou help om 'n probleem op jou kredietrekord te verstaan en die moontlike selfdoenstappe te verduidelik. Wat gebeur tans op jou kredietrekord?",placeholder:"Tik jou vraag…",send:"Stuur",whatsapp:"Praat met 'n medewerker op WhatsApp",full:"Volledige assistentbladsy"}
  };
  let selectedLanguage=localStorage.getItem("ri_chat_language")||"en";
  if(!["en","zu","af"].includes(selectedLanguage))selectedLanguage="en";
  function applyLanguage(lang){selectedLanguage=["en","zu","af"].includes(lang)?lang:"en";localStorage.setItem("ri_chat_language",selectedLanguage);languageSelect.value=selectedLanguage;const t=uiText[selectedLanguage];root.querySelector("[data-ri-subtitle]").textContent=t.subtitle;root.querySelector('label[for="ri-language"]').textContent=t.choose;root.querySelector("[data-ri-disclaimer]").textContent=t.disclaimer;const welcome=root.querySelector("[data-ri-welcome]");if(welcome)welcome.textContent=t.welcome;input.placeholder=t.placeholder;input.setAttribute("aria-label",t.placeholder);root.querySelector(".ri-send").textContent=t.send;root.querySelector(".ri-links a:first-child").textContent=t.whatsapp;root.querySelector(".ri-links a:last-child").textContent=t.full;root.querySelectorAll("[data-prompt]").forEach(b=>{const label=b.getAttribute("data-label-"+selectedLanguage);if(label)b.textContent=label;});}
  languageSelect.addEventListener("change",()=>applyLanguage(languageSelect.value));
  applyLanguage(selectedLanguage);
  let riConsent=localStorage.getItem("ri_analytics_consent")==="yes";
  let riSession=localStorage.getItem("ri_analytics_session");
  if(!riSession){riSession=(crypto.randomUUID?crypto.randomUUID():("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,x=>{const r=Math.random()*16|0;return(x==="x"?r:(r&3|8)).toString(16)})));localStorage.setItem("ri_analytics_session",riSession);}
  const consentBox=document.createElement("div");
  consentBox.style.cssText="flex:0 0 auto;max-height:none;overflow:visible;padding:7px 12px;background:#0c1728;border-top:1px solid #29415f;font-size:10px;line-height:1.35;color:#a9bad0";
  shell.appendChild(consentBox);
  function renderConsent(showPrompt=false){
    const saved=localStorage.getItem("ri_analytics_consent");
    if(!showPrompt&&(saved==="yes"||saved==="no")){
      consentBox.innerHTML='<span>Optional analytics: '+(saved==="yes"?'on — limited usage events only; chat text is not stored in analytics.':'off — no optional assistant analytics events are recorded.')+'</span><div style="margin-top:5px"><button type="button" data-ri-change style="background:#243b56;color:#fff;border:0;border-radius:7px;padding:5px 8px;font-size:10px">Privacy settings</button> <a href="/privacy-policy/" target="_blank" rel="noopener" style="color:#67e3c1">Privacy Policy</a></div>';
    }else{
      consentBox.innerHTML='<span>Optional analytics only: language, session events and product category — never chat text. Your messages are sent to the AI service to generate replies. Choosing “No thanks” does not block chat. <a href="/privacy-policy/" target="_blank" rel="noopener" style="color:#67e3c1">Privacy Policy</a></span><div style="display:flex;gap:7px;margin-top:6px"><button type="button" data-ri-consent="yes" style="background:#20c997;color:#06251f;border:0;border-radius:7px;padding:5px 9px;font-size:10px;font-weight:700">Allow analytics</button><button type="button" data-ri-consent="no" style="background:#243b56;color:#fff;border:0;border-radius:7px;padding:5px 9px;font-size:10px">No thanks</button></div>';
    }
  }
  function setRiConsent(value){riConsent=value;localStorage.setItem("ri_analytics_consent",value?"yes":"no");renderConsent(false);}
  consentBox.addEventListener("click",event=>{
    const choice=event.target.closest("[data-ri-consent]");
    if(choice){setRiConsent(choice.dataset.riConsent==="yes");return;}
    if(event.target.closest("[data-ri-change]"))renderConsent(true);
  });
  renderConsent();

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
    requestAnimationFrame(()=>{log.scrollTop=log.scrollHeight;});
  }
  // Four-by-four consultative intake: one question per turn, then reflect and recommend.
  const intakeQuestions = {
    en: [
      "What made you look into this now?",
      "What have you already tried — for example, contacting the creditor, debt counsellor or credit bureau?",
      "If this remains unresolved, what is the main difficulty it causes for you?",
      "Thank you. I have the four key details. May I summarise what I understand and suggest the most relevant next step?"
    ],
    zu: [
      "Yini ekwenze wafuna ukulungisa le ndaba manje?",
      "Yini osuke wayizama kuze kube manje — njengokuxhumana nomkweletisi, umeluleki wezikweletu noma i-credit bureau?",
      "Uma le nkinga ingalungiseki, ikuphi ubunzima obukhulu ekudalela bona?",
      "Ngiyabonga. Senginolwazi olubalulekile. Ngingafingqa engikuzwile bese ngiphakamisa isinyathelo esifanele?"
    ],
    af: [
      "Wat het jou laat besluit om dit nou aan te spreek?",
      "Wat het jy reeds probeer — byvoorbeeld om die krediteur, skuldberader of kredietburo te kontak?",
      "As dit nie opgelos word nie, wat is die grootste probleem wat dit vir jou veroorsaak?",
      "Dankie. Ek het nou die vier belangrike besonderhede. Mag ek opsom wat ek verstaan en die toepaslike volgende stap voorstel?"
    ]
  };
  let intakeStep = 0;
  let intakeStarted = false;
  function addHistory(role, content){history.push({role,content});}
  async function send(text){
    const clean=text.trim();if(!clean)return;
    add(clean,"user");addHistory("user",clean);input.value="";
    input.disabled=true;root.querySelector(".ri-send").disabled=true;
    // The opening welcome / quick prompts establish Question 1 (the problem).
    // Ask only one follow-up at a time and wait for the customer's answer.
    if(!intakeStarted){
      intakeStarted=true;
      intakeStep=0;
    } else if(intakeStep < 4){
      const nextQuestion=intakeQuestions[selectedLanguage][intakeStep];
      addHistory("assistant",nextQuestion);
      add(nextQuestion,"assistant");
      intakeStep++;
      input.disabled=false;root.querySelector(".ri-send").disabled=false;input.focus();
      return;
    }
    // After the four diagnostic questions, send the full conversation for a
    // concise reflection and a relevant, permission-based recommendation.
    if(intakeStep===4){
      const permissionText=clean.toLowerCase();
      const affirmative=/^(yes|yeah|yep|sure|please|go ahead|okay|ok|yebo|ngicela|ja|asseblief|goed|sure)$/i.test(permissionText);
      if(!affirmative){
        const prompt={
          en:"Please reflect the customer's four answers in a short summary. Do not ask another diagnostic question. Explain the most relevant educational next step, state what the customer would need to do themselves, avoid guarantees, and ask whether they want details about the relevant DIY guidance.",
          zu:"Fingqa kafushane izimpendulo ezine zekhasimende. Ungabuzi omunye umbuzo wokuxilonga. Chaza isinyathelo solwazi esifanele, cacisa ukuthi ikhasimende kufanele lenzeni ngokwalo, ungathembisi imiphumela, bese ubuza ukuthi liyafuna yini imininingwane yosizo lwe-DIY olufanele.",
          af:"Sommeer die kliënt se vier antwoorde kortliks. Moenie nog 'n diagnostiese vraag vra nie. Verduidelik die toepaslike opvoedkundige volgende stap, sê wat die kliënt self moet doen, moenie resultate waarborg nie, en vra of hulle besonderhede oor die toepaslike selfdoenleiding wil hê."
        }[selectedLanguage];
        addHistory("user",prompt);
      }
    }
    const pending=add("Thinking…","assistant");
    try{
      const res=await fetch("/api/assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:history.slice(-14),analyticsConsent:riConsent,sessionId:riSession,language:selectedLanguage})});
      const data=await res.json();if(data.reply)renderAssistant(pending,data.reply);else pending.textContent=data.error||"Sorry, I could not respond. Please contact WhatsApp support.";
      if(data.reply)addHistory("assistant",data.reply);
      requestAnimationFrame(()=>{log.scrollTop=log.scrollHeight;});
    }catch(e){pending.textContent="The assistant is temporarily unavailable. Please contact WhatsApp support at 075 793 1848.";requestAnimationFrame(()=>{log.scrollTop=log.scrollHeight;});}
    finally{input.disabled=false;root.querySelector(".ri-send").disabled=false;input.focus();}
  }
  form.addEventListener("submit",e=>{e.preventDefault();send(input.value);});
  root.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.prompt)));
})();