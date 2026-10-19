CREATE TABLE IF NOT EXISTS payments (
  pf_payment_id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('complete', 'refunded', 'revoked'))
);
CREATE INDEX IF NOT EXISTS idx_payments_email_created ON payments (buyer_email, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_expiry ON payments (expires_at);
