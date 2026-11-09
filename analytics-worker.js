/**
 * Removal Inspector analytics API.
 * Bindings: DB (D1). Vars: ACCESS_TEAM_DOMAIN, ACCESS_AUD (Cloudflare Access team domain and app AUD).
 * Public ingestion: POST /api/collect. Private reads: /api/admin/* protected by Access JWT.
 * Never ingest raw chat transcripts, ID numbers, credit reports, account/payment details.
 */
const cors = { "content-type":"application/json; charset=utf-8", "cache-control":"no-store" };
const json=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:cors});
const allowedTypes=new Set(["page_view","chat_started","chat_message_classified","chat_completed","whatsapp_click","checker_completed","lead_intent","sales_offer_shown","sales_objection","purchase_verified","cta_click"]);
const clean=(v,n=80)=>typeof v==="string"?v.replace(/[\u0000-\u001f<>]/g,"").slice(0,n):null;
async function verifyAccess(request,env){
  const token=request.headers.get("Cf-Access-Jwt-Assertion");if(!token||!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD)return false;
  try{
    const [h,p,s]=token.split(".");const header=JSON.parse(atob(h.replace(/-/g,"+").replace(/_/g,"/")));const payload=JSON.parse(atob(p.replace(/-/g,"+").replace(/_/g,"/")));
    if(payload.aud!==env.ACCESS_AUD||payload.iss!==`https://${env.ACCESS_TEAM_DOMAIN}/`||payload.exp<Date.now()/1000)return false;
    const jwks=await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`).then(r=>r.json());const jwk=jwks.keys.find(k=>k.kid===header.kid);if(!jwk)return false;
    const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    const sig=Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,sig,new TextEncoder().encode(h+"."+p));
  }catch{return false;}
}
export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/health")return json({ok:true,service:"removal-inspector-analytics"});
  if(url.pathname==="/api/collect"&&request.method==="POST"){
    if(!env.DB)return json({error:"Database unavailable"},503);
    const origin=request.headers.get("Origin");if(origin&&!["https://removalinspector.co.za","https://www.removalinspector.co.za"].includes(origin))return json({error:"Origin not allowed"},403);
    let b;try{b=await request.json()}catch{return json({error:"Invalid JSON"},400)}
    if(!allowedTypes.has(b.event_type))return json({error:"Unsupported event type"},400);
    const sid=clean(b.session_id,64),cid=clean(b.conversation_id,64);if(!sid)return json({error:"session_id required"},400);
    const event={event_type:b.event_type,session_id:sid,conversation_id:cid,page_path:clean(b.page_path,180),source:clean(b.source,80),language:clean(b.language,12),topic:clean(b.topic,60),intent:clean(b.intent,40),outcome:clean(b.outcome,40),created_at:new Date().toISOString()};
    await env.DB.prepare("INSERT INTO analytics_events (event_type,session_id,conversation_id,page_path,source,language,topic,intent,outcome,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(event.event_type,event.session_id,event.conversation_id,event.page_path,event.source,event.language,event.topic,event.intent,event.outcome,event.created_at).run();
    return json({ok:true});
  }
  if(url.pathname.startsWith("/api/admin/")){
    if(!await verifyAccess(request,env))return json({error:"Unauthorized"},401);
    if(!env.DB)return json({error:"Database unavailable"},503);
    const days=Math.min(90,Math.max(1,Number(url.searchParams.get("days"))||7));
    const since=new Date(Date.now()-days*86400000).toISOString();
    const one=async(sql,...args)=>(await env.DB.prepare(sql).bind(...args).first())||{};
    const all=async(sql,...args)=>(await env.DB.prepare(sql).bind(...args).all()).results||[];
    const metrics=await one(`SELECT COUNT(DISTINCT CASE WHEN event_type='page_view' THEN session_id END) sessions,COUNT(DISTINCT CASE WHEN event_type='chat_started' THEN conversation_id END) conversations,COUNT(CASE WHEN event_type='whatsapp_click' THEN 1 END) whatsappClicks,COUNT(CASE WHEN event_type='purchase_verified' THEN 1 END) verifiedSales FROM analytics_events WHERE created_at>=?`,since);
    const daily=await all(`SELECT strftime('%Y-%m-%d',created_at) day,COUNT(*) count FROM analytics_events WHERE created_at>=? GROUP BY day ORDER BY day`,since);
    const grouped=async(field)=>all(`SELECT ${field} label,COUNT(*) count FROM analytics_events WHERE created_at>=? AND ${field} IS NOT NULL GROUP BY ${field} ORDER BY count DESC LIMIT 8`,since);
    const recent=await all("SELECT event_type,page_path,language,topic,source,created_at FROM analytics_events WHERE created_at>=? ORDER BY created_at DESC LIMIT 30",since);
    const intents=await grouped("intent"),topics=await grouped("topic"),languages=await grouped("language");
    return json({generatedAt:new Date().toISOString(),days,metrics,daily:daily.map(x=>({label:x.day.slice(5),count:x.count})),intents,topics,languages,recent});
  }
  return json({error:"Not found"},404);
}};