(function(){
  'use strict';
  var KEY='ri_cookie_consent_v1';
  var saved=null;
  try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  var style=document.createElement('style');
  style.textContent='#ri-cookie-banner,#ri-cookie-panel{font-family:system-ui,-apple-system,Segoe UI,sans-serif;position:fixed;z-index:99999;color:#edf3ff;background:#10182b;border:1px solid rgba(90,169,255,.35);box-shadow:0 16px 50px rgba(0,0,0,.4);border-radius:14px}#ri-cookie-banner{left:16px;right:16px;bottom:16px;max-width:760px;margin:auto;padding:18px;display:none}#ri-cookie-banner p,#ri-cookie-panel p{font-size:13px;line-height:1.55;color:#c1cce1;margin:6px 0 14px}#ri-cookie-banner strong,#ri-cookie-panel strong{color:#fff}#ri-cookie-actions{display:flex;gap:9px;flex-wrap:wrap}#ri-cookie-banner button,#ri-cookie-panel button,#ri-cookie-settings{border:0;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer}#ri-cookie-accept{background:#00df8a;color:#04140c}#ri-cookie-reject,#ri-cookie-customize{background:#202b45;color:#edf3ff;border:1px solid #3b4968!important}#ri-cookie-settings{position:fixed;z-index:99998;bottom:12px;left:12px;background:#18243c;color:#eaf2ff;border:1px solid #425477;font-size:12px;padding:9px 12px}#ri-cookie-panel{display:none;left:16px;right:16px;top:50%;transform:translateY(-50%);max-width:520px;margin:auto;padding:22px}#ri-cookie-panel h2{font-size:20px;margin:0 0 8px}#ri-cookie-panel label{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid #2c3955;font-size:14px}#ri-cookie-panel input{width:18px;height:18px;accent-color:#00df8a}#ri-cookie-panel .ri-essential{color:#9eabc5;font-size:12px}#ri-cookie-panel .ri-buttons{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}#ri-cookie-panel button{background:#00df8a;color:#04140c}#ri-cookie-panel button.secondary{background:#202b45;color:#edf3ff;border:1px solid #3b4968}';
  document.head.appendChild(style);
  var banner=document.createElement('section');
  banner.id='ri-cookie-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Cookie preferences');
  banner.innerHTML='<strong>Your privacy choices</strong><p>Essential technologies help this website work and stay secure. Optional analytics and advertising technologies are off by default. Choose whether to allow optional categories, or customise your settings. You can change your choice later.</p><div id="ri-cookie-actions"><button id="ri-cookie-accept" type="button">Accept optional</button><button id="ri-cookie-reject" type="button">Reject optional</button><button id="ri-cookie-customize" type="button">Customise</button></div>';
  document.body.appendChild(banner);
  var settings=document.createElement('button');
  settings.id='ri-cookie-settings';settings.type='button';settings.textContent='Cookie settings';
  settings.setAttribute('aria-label','Revisit cookie settings');
  document.body.appendChild(settings);
  var panel=document.createElement('section');panel.id='ri-cookie-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','ri-cookie-title');
  panel.innerHTML='<h2 id="ri-cookie-title">Cookie settings</h2><p>Choose which optional categories you allow. Essential storage is always active for core site functions and security.</p><label><span><strong>Essential</strong><br><span class="ri-essential">Required for basic site operation; always on.</span></span><input type="checkbox" checked disabled></label><label><span><strong>Analytics</strong><br><span class="ri-essential">Optional measurement technologies.</span></span><input id="ri-analytics" type="checkbox"></label><label><span><strong>Advertising</strong><br><span class="ri-essential">Optional advertising and ad measurement technologies.</span></span><input id="ri-advertising" type="checkbox"></label><div class="ri-buttons"><button id="ri-cookie-save" type="button">Save choices</button><button id="ri-cookie-close" class="secondary" type="button">Close</button></div>';
  document.body.appendChild(panel);
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function write(v){v.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(v));banner.style.display='none';panel.style.display='none'}
  function open(){var v=read()||{};document.getElementById('ri-analytics').checked=!!v.analytics;document.getElementById('ri-advertising').checked=!!v.advertising;panel.style.display='block'}
  document.getElementById('ri-cookie-accept').onclick=function(){write({essential:true,analytics:true,advertising:true})};
  document.getElementById('ri-cookie-reject').onclick=function(){write({essential:true,analytics:false,advertising:false})};
  document.getElementById('ri-cookie-customize').onclick=open;
  document.getElementById('ri-cookie-save').onclick=function(){write({essential:true,analytics:document.getElementById('ri-analytics').checked,advertising:document.getElementById('ri-advertising').checked})};
  document.getElementById('ri-cookie-close').onclick=function(){panel.style.display='none'};
  settings.onclick=open;
  if(!saved)banner.style.display='block';
})();