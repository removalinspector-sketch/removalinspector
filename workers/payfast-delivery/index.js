const ORIGIN = "https://removalinspector.co.za";
const PRODUCT_BY_CENTS = {
  29700: { id: "starter", name: "Listing Clarity Starter", key: "RI-ListingClarity-R297-Kit.zip" },
  34700: { id: "prescribed", name: "Collections & Prescription Path", key: "RI-Collections-R347-Kit.zip" },
  39700: { id: "adverse", name: "Arrears Correction Kit", key: "RI-Arrears-R397-Kit.zip" },
  49700: { id: "debt-review", name: "Debt Review Exit Edu", key: "RI-DebtReview-R497-Kit.zip" },
  54700: { id: "judgement", name: "Judgement Review Pathway", key: "RI-Judgement-R547-Kit.zip" },
  59700: { id: "ultimate", name: "Full Shield Bundle", key: "RI-FullShield-R597-Bundle.zip" }
};
const enc = new TextEncoder();
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": ORIGIN, "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type" }
});
function b64url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/=/g, "").replaceAll("+", "-").replaceAll("/", "_");
}
function unb64url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  s += "=".repeat((4 - s.length % 4) % 4);
  const binary = atob(s);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
async function tokenFor(payload, secret) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body)));
  return body + "." + b64url(sig);
}
async function readToken(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("HMAC", key, unb64url(parts[1]), enc.encode(parts[0]));
  if (!ok) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(unb64url(parts[0])));
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch { return null; }
}
function corsPreflight() {
  return new Response(null, { status: 204, headers: { "access-control-allow-origin": ORIGIN, "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" } });
}
async function handleITN(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!env.PAYFAST_MERCHANT_ID || !env.PAYMENTS || !env.KITS || !env.DOWNLOAD_TOKEN_SECRET) return new Response("Delivery service not configured", { status: 503 });
  const raw = await request.text();
  if (!raw || raw.length > 65536) return new Response("Invalid notification", { status: 400 });
  // Ask PayFast to validate the exact notification body; never trust the browser return URL.
  let validation;
  try {
    const res = await fetch("https://www.payfast.co.za/eng/query/validate", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: raw
    });
    validation = (await res.text()).trim();
  } catch {
    return new Response("PayFast validation unavailable", { status: 502 });
  }
  if (validation !== "VALID") return new Response("Invalid PayFast notification", { status: 400 });
  const p = new URLSearchParams(raw);
  if (p.get("merchant_id") !== env.PAYFAST_MERCHANT_ID) return new Response("Merchant mismatch", { status: 400 });
  if (p.get("payment_status") !== "COMPLETE") return new Response("Notification received; payment not complete", { status: 200 });
  const paymentId = (p.get("pf_payment_id") || "").trim();
  const amount = Number(p.get("amount_gross"));
  if (!paymentId || !Number.isFinite(amount)) return new Response("Missing payment fields", { status: 400 });
  const cents = Math.round(amount * 100);
  const product = PRODUCT_BY_CENTS[cents];
  if (!product) return new Response("Unexpected payment amount", { status: 400 });
  const record = {
    status: "verified", pf_payment_id: paymentId, kit: product.id, product_name: product.name,
    amount_cents: cents, verified_at: new Date().toISOString()
  };
  // Payment ID is idempotent: repeat ITNs overwrite the same verified record.
  await env.PAYMENTS.put("pf:" + paymentId, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 60 });
  return new Response("OK", { status: 200, headers: { "cache-control": "no-store" } });
}
async function handleStatus(url, env) {
  const paymentId = (url.searchParams.get("pf_payment_id") || "").trim();
  if (!/^[0-9]{4,40}$/.test(paymentId)) return json({ status: "needs_payment_reference", message: "Enter the PayFast payment ID shown on your payment confirmation." }, 400);
  const raw = await env.PAYMENTS.get("pf:" + paymentId);
  if (!raw) return json({ status: "pending", message: "Payment has not been verified yet. Wait a moment and try again. If you have just paid, PayFast may still be processing the confirmation." }, 202);
  const purchase = JSON.parse(raw);
  if (purchase.status !== "verified") return json({ status: "pending" }, 202);
  const token = await tokenFor({ pf_payment_id: paymentId, kit: purchase.kit, exp: Math.floor(Date.now() / 1000) + 48 * 60 * 60 }, env.DOWNLOAD_TOKEN_SECRET);
  return json({ status: "verified", product: purchase.product_name, amount: (purchase.amount_cents / 100).toFixed(2), expires_in_hours: 48, download_url: "/api/download?token=" + encodeURIComponent(token) });
}
async function handleDownload(url, env) {
  const token = url.searchParams.get("token") || "";
  const payload = await readToken(token, env.DOWNLOAD_TOKEN_SECRET || "");
  if (!payload || !payload.pf_payment_id || !payload.kit) return new Response("This download link is invalid or expired. Return to your payment confirmation and verify your purchase again.", { status: 403 });
  const raw = await env.PAYMENTS.get("pf:" + payload.pf_payment_id);
  if (!raw) return new Response("Purchase verification expired. Contact support for help.", { status: 403 });
  const purchase = JSON.parse(raw);
  const product = PRODUCT_BY_CENTS[purchase.amount_cents];
  if (purchase.status !== "verified" || !product || product.id !== payload.kit) return new Response("Purchase could not be verified.", { status: 403 });
  const object = await env.KITS.get(product.key);
  if (!object) return new Response("Your payment is verified, but the product file is not yet installed. Contact support@removalinspector.co.za and quote your PayFast payment ID.", { status: 503 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", "application/zip");
  headers.set("content-disposition", 'attachment; filename="' + product.key.replace(/["\\\\]/g, "") + '"');
  headers.set("cache-control", "private, no-store");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { status: 200, headers });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return corsPreflight();
    if (url.pathname === "/api/payfast-itn") return handleITN(request, env);
    if (url.pathname === "/api/payment-status" && request.method === "GET") return handleStatus(url, env);
    if (url.pathname === "/api/download" && request.method === "GET") return handleDownload(url, env);
    if (url.pathname === "/health") return json({ service: "Removal Inspector payment delivery", status: "online" });
    return json({ error: "Not found" }, 404);
  }
};