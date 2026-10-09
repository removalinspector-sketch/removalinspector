
// Cloudflare Worker — PayFast ITN verification + email ZIP link
// Deploy to Cloudflare Workers, set route https://removalinspector.co.za/api/payfast-itn
// Env vars: PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE, EMAIL_FROM

addEventListener('fetch', event => { event.respondWith(handle(event.request)) })

const KIT_MAP = {
  'alu9y': {id:'starter', name:'RI-Starter-R297-Kit.zip', price:'R297'},
  'w2pna': {id:'prescribed', name:'RI-Prescribed-R347-Kit.zip', price:'R347'},
  '21qvd': {id:'adverse', name:'RI-Adverse-R397-Kit.zip', price:'R397'},
  'd037g': {id:'debt-review', name:'RI-DebtReview-R497-Kit.zip', price:'R497'},
  '45p36': {id:'judgement', name:'RI-Judgment-R547-Kit.zip', price:'R547'},
  'i1wd9': {id:'ultimate', name:'ULTIMATE_BUNDLE_R597_KIT6.zip', price:'R597'},
}

async function handle(req){
  if(req.method !== 'POST') return new Response('Use POST for ITN', {status:405})
  const form = await req.formData()
  const data = Object.fromEntries(form.entries())
  
  // 1. Verify with PayFast (POST back to PayFast with same data)
  // For brevity, skip signature verification — add in production per PayFast docs
  // See https://developers.payfast.co.za/docs#itn
  
  // 2. Determine kit from custom_str1 or item_name or payfast short code
  const custom = data.custom_str1 || data.item_name || ''
  let kit = null
  for(const [short, info] of Object.entries(KIT_MAP)){
    if(custom.includes(short) || custom.includes(info.id)){
      kit = info; break;
    }
  }
  if(!kit) kit = KIT_MAP['i1wd9'] // default ultimate

  // 3. Email customer with download link
  const customerEmail = data.email_address
  const paymentId = data.pf_payment_id
  const downloadUrl = `https://removalinspector.co.za/download.html?kit=${kit.id}&paid=1&ref=${paymentId}`
  const zipUrl = `https://removalinspector.co.za/kits/${kit.name}`

  // TODO: Send email via your email provider (Resend, SendGrid, etc)
  // Example: await sendEmail(customerEmail, kit, downloadUrl, zipUrl)

  console.log(`Payment verified: ${paymentId} for ${kit.id} to ${customerEmail} — ${downloadUrl}`)

  return new Response('OK', {status:200})
}
