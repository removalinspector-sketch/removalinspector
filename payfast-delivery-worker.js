/**
 * Removal Inspector — secure PayFast digital delivery.
 *
 * Required bindings:
 *   D1 database: DB (run schema.sql)
 *   R2 bucket:   KITS_BUCKET (upload private ZIPs under the keys in PRODUCT_MAP)
 * Required secrets/vars:
 *   PAYFAST_MERCHANT_ID, RESEND_API_KEY
 *   DELIVERY_FROM (verified sender, e.g. Removal Inspector <support@removalinspector.co.za>)
 *   PUBLIC_ORIGIN (https://removalinspector.co.za)
 *   PAYFAST_MODE ("live" or "sandbox")
 *
 * Do not put ZIP files in the public website repository. R2 must remain private.
 */

const PRODUCT_MAP = {
  "297.00": { id: "starter", name: "Starter Kit", key: "kits/starter.zip", amount: 297 },
  "347.00": { id: "prescribed", name: "Prescribed Debt Kit", key: "kits/prescribed.zip", amount: 347 },
  "397.00": { id: "adverse", name: "Adverse Information Kit", key: "kits/adverse.zip", amount: 397 },
  "497.00": { id: "complete", name: "Complete Kit", key: "kits/complete.zip", amount: 497 },
  "547.00": { id: "judgment", name: "Judgment Kit", key: "kits/judgment.zip", amount: 547 },
  "597.00": { id: "ultimate", name: "Ultimate Bundle", key: "kits/ultimate.zip", amount: 597 },
};
const TOKEN_TTL_SECONDS = 48 * 60 * 60;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
function normalAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "";
}
async function sha256Hex(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}
function baseOrigin(env) {
  return (env.PUBLIC_ORIGIN || "https://removalinspector.co.za").replace(/\/$/, "");
}
function payfastValidateUrl(env) {
  return env.PAYFAST_MODE === "sandbox"
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";
}
async function sendDeliveryEmail(env, to, product, url, expiresAt) {
  if (!env.RESEND_API_KEY || !env.DELIVERY_FROM || !to) {
    console.error("Delivery email not configured; do not log the token or download URL.");
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.DELIVERY_FROM,
      to: [to],
      subject: `Your Removal Inspector ${product.name} download`,
      text:
        `Thank you for your purchase.\n\nProduct: ${product.name}\n\nSecure download (valid for 48 hours):\n${url}\n\nIf the link expires, email support@removalinspector.co.za and include your PayFast payment reference. Do not send card details or identity documents.\n\nRemoval Inspector provides educational self-help resources and does not guarantee a credit-record change.\n\nLink expiry: ${new Date(expiresAt * 1000).toISOString()}`,
    }),
  });
  if (!response.ok) console.error("Delivery email provider returned status", response.status);
  return response.ok;
}
async function handleITN(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawBody = await request.text();
  if (rawBody.length > 32_000) return new Response("Payload too large", { status: 413 });

  // Ask PayFast to validate the exact notification body. Do not unlock from return_url,
  // a query-string flag, browser storage, or an unverified payment reference.
  const validation = await fetch(payfastValidateUrl(env), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: rawBody,
  });
  const validationText = (await validation.text()).trim();
  if (!validation.ok || validationText !== "VALID") {
    console.warn("PayFast ITN validation failed", validation.status, validationText.slice(0, 80));
    return new Response("Invalid notification", { status: 400 });
  }

  const form = new URLSearchParams(rawBody);
  const data = Object.fromEntries(form.entries());
  if (!safeEqual(String(data.merchant_id || ""), String(env.PAYFAST_MERCHANT_ID || ""))) {
    return new Response("Merchant mismatch", { status: 400 });
  }
  if (data.payment_status !== "COMPLETE") return new Response("Ignored non-complete payment", { status: 200 });
  if (!data.pf_payment_id || !data.email_address) return new Response("Missing payment fields", { status: 400 });

  const amount = normalAmount(data.amount_gross);
  const product = PRODUCT_MAP[amount];
  if (!product) return new Response("Unrecognised product amount", { status: 400 });

  // Idempotency: PayFast may retry ITNs. Never mint another token for the same payment.
  const existing = await env.DB.prepare(
    "SELECT pf_payment_id FROM payments WHERE pf_payment_id = ?1"
  ).bind(String(data.pf_payment_id)).first();
  if (existing) return new Response("OK", { status: 200 });

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + TOKEN_TTL_SECONDS;
  const downloadUrl = `${baseOrigin(env)}/api/download?token=${token}`;

  // Unique payment ID protects against duplicate notifications/race conditions.
  try {
    await env.DB.prepare(
      `INSERT INTO payments
       (pf_payment_id, merchant_id, product_id, buyer_email, amount_cents, token_hash, created_at, expires_at, status)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'complete')`
    ).bind(
      String(data.pf_payment_id), String(data.merchant_id), product.id,
      String(data.email_address).slice(0, 254), Math.round(product.amount * 100),
      tokenHash, now, expiresAt
    ).run();
  } catch (error) {
    // A concurrent retry may have inserted the unique payment ID first.
    const raced = await env.DB.prepare(
      "SELECT pf_payment_id FROM payments WHERE pf_payment_id = ?1"
    ).bind(String(data.pf_payment_id)).first();
    if (raced) return new Response("OK", { status: 200 });
    console.error("Payment persistence failed", String(error));
    return new Response("Temporary storage failure", { status: 500 });
  }

  const sent = await sendDeliveryEmail(env, String(data.email_address), product, downloadUrl, expiresAt);
  if (!sent) {
    // Payment remains recorded. Support can safely issue a fresh token after checking the payment.
    console.error("Payment recorded but delivery email failed for payment", String(data.pf_payment_id));
  }
  return new Response("OK", { status: 200 });
}
async function handleReissue(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const auth = request.headers.get("authorization") || "";
  if (!env.DELIVERY_ADMIN_KEY || !safeEqual(auth, `Bearer ${env.DELIVERY_ADMIN_KEY}`)) {
    return json({ error: "Unauthorized" }, 401);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const paymentId = String(body.pf_payment_id || "").trim();
  if (!paymentId || paymentId.length > 100) return json({ error: "PayFast payment reference is required." }, 400);

  const payment = await env.DB.prepare(
    "SELECT pf_payment_id, product_id, buyer_email, status FROM payments WHERE pf_payment_id = ?1"
  ).bind(paymentId).first();
  if (!payment || payment.status !== "complete") return json({ error: "No verified completed payment found." }, 404);

  const product = Object.values(PRODUCT_MAP).find(p => p.id === payment.product_id);
  if (!product) return json({ error: "Product configuration error." }, 500);
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  await env.DB.prepare(
    "UPDATE payments SET token_hash = ?1, expires_at = ?2 WHERE pf_payment_id = ?3 AND status = 'complete'"
  ).bind(tokenHash, expiresAt, paymentId).run();

  const url = `${baseOrigin(env)}/api/download?token=${token}`;
  const sent = await sendDeliveryEmail(env, payment.buyer_email, product, url, expiresAt);
  if (!sent) return json({ error: "Payment is verified, but email delivery failed. Check the email provider configuration and retry." }, 502);
  return json({ ok: true, product: product.id, expires_at: expiresAt });
}
async function handleDownload(request, env) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return json({ error: "Invalid or expired download link." }, 400);

  const tokenHash = await sha256Hex(token);
  const payment = await env.DB.prepare(
    "SELECT pf_payment_id, product_id, expires_at, status FROM payments WHERE token_hash = ?1"
  ).bind(tokenHash).first();

  const now = Math.floor(Date.now() / 1000);
  if (!payment || payment.status !== "complete" || Number(payment.expires_at) < now) {
    return json({ error: "This download link is invalid or has expired. Contact support@removalinspector.co.za with your PayFast reference." }, 403);
  }
  const product = Object.values(PRODUCT_MAP).find(p => p.id === payment.product_id);
  if (!product) return json({ error: "Product configuration error." }, 500);

  const object = await env.KITS_BUCKET.get(product.key);
  if (!object) {
    console.error("Missing private R2 product object", product.key);
    return json({ error: "Your payment is recorded, but this file is not available yet. Contact support@removalinspector.co.za." }, 503);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", "application/zip");
  headers.set("content-disposition", `attachment; filename="${product.id}-removal-inspector-kit.zip"`);
  headers.set("cache-control", "private, no-store, max-age=0");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/payfast-itn") return handleITN(request, env);
    if (url.pathname === "/api/download") return handleDownload(request, env);\n    if (url.pathname === "/api/reissue") return handleReissue(request, env);
    if (url.pathname === "/api/health") {
      return json({ service: "removal-inspector-delivery", status: "ok" });
    }
    return new Response("Not found", { status: 404 });
  },
};
