// netlify/functions/create-checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  IRRIGOLD_2: process.env.STRIPE_PRICE_IRRIGOLD_2,
  IRRIGOLD_3: process.env.STRIPE_PRICE_IRRIGOLD_3,
  IRRIGOLD_4: process.env.STRIPE_PRICE_IRRIGOLD_4,
  IRRIGOLD_5: process.env.STRIPE_PRICE_IRRIGOLD_5,
  IRRIGOLD_6: process.env.STRIPE_PRICE_IRRIGOLD_6,
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { model, qty, notes, province } = req.body || {};
    const quantity = Math.max(1, Math.min(10, parseInt(qty || 1, 10)));

    const price = PRICE_MAP[model];
    if (!price) return res.status(400).json({ error: "Modello non valido" });

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity }],
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#checkout`,
      metadata: {
        product: "IRRIGOLD",
        model: String(model),
        notes: String(notes || "").slice(0, 450),
        province: String(province || "").slice(0, 40),
      },
      shipping_address_collection: { allowed_countries: ["IT"] },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err?.message || err });
  }
}