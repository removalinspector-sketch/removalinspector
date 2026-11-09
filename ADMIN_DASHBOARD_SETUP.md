# Removal Inspector Intelligence Dashboard — implementation notes

## Files
- `admin/index.html`: private dashboard UI (noindex; no fabricated metrics).
- `analytics-worker.js`: event ingestion and authenticated reporting API.
- `analytics-schema.sql`: D1 schema.

## Required deployment steps
1. Create a dedicated Cloudflare D1 database and apply `analytics-schema.sql`.
2. Deploy `analytics-worker.js` as a separate Worker with D1 binding named `DB`.
3. Set Worker variables `ACCESS_TEAM_DOMAIN` (e.g. your-team.cloudflareaccess.com) and `ACCESS_AUD` (the Access application's AUD tag).
4. Configure Cloudflare Access to protect the admin app and `/api/admin/*`. Restrict to the owner's identity. Do not expose admin API without Access.
5. Route the Worker API to a dedicated hostname/path and adjust the dashboard fetch path if using a separate hostname. Keep the existing public site and PayFast delivery Worker untouched.
6. Serve `admin/index.html` behind the same Access application, e.g. a private admin hostname. Do not publish it openly.
7. Add the event snippet below to the public website. Then wire chatbot callbacks to send classified, redacted events.

## Browser event collector (add to public pages)
```html
<script>
(() => {
  const sidKey = "ri_analytics_session";
  let sid = sessionStorage.getItem(sidKey);
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem(sidKey, sid); }
  const send = (event_type, extra = {}) => {
    const body = JSON.stringify({event_type,session_id:sid,page_path:location.pathname,source:document.referrer?new URL(document.referrer).hostname:"direct",...extra});
    const url = "https://YOUR-ANALYTICS-HOST/api/collect";
    if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body],{type:"application/json"}));
    else fetch(url,{method:"POST",headers:{"content-type":"application/json"},body,keepalive:true}).catch(()=>{});
  };
  send("page_view");
  document.addEventListener("click",e=>{
    const a=e.target.closest("a"); if(!a)return;
    if(/wa\.me|api\.whatsapp\.com/i.test(a.href))send("whatsapp_click");
    if(a.matches("[data-track-cta]"))send("cta_click",{intent:a.dataset.trackCta||null});
  });
  window.RemovalInspectorAnalytics = {track:(type,data={})=>send(type,data)};
})();
</script>
```

## Chatbot integration contract
Call `window.RemovalInspectorAnalytics.track(...)` from the chatbot's actual lifecycle callbacks:
- `chat_started`: include a random conversation_id.
- `chat_message_classified`: send only `language`, `topic`, `intent`; never send message text.
- `chat_completed`: include an allowed outcome label.
- `lead_intent`: include a broad intent label such as `debt_review`, `judgment`, `paid_account`.
- `sales_objection`: use a controlled category such as `price`, `trust`, `needs_time`, `not_ready`.
- `purchase_verified`: emit only from the trusted server-side PayFast ITN handler after validation, not from the browser.

## Important
This first version deliberately avoids collecting transcripts, names, phone numbers, ID numbers, bureau reports, financial account details or payment credentials. Use aggregate intent/topic labels. Obtain and disclose appropriate consent, publish a clear privacy notice and set a retention period before production. Sales/revenue reporting must be reconciled with verified payment records; chatbot statements are not proof of payment.
