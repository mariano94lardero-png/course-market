import Stripe from "stripe";

// Falls back to a placeholder so the app builds/runs before real Stripe keys
// are configured. Checkout calls will fail with a clear Stripe error until
// STRIPE_SECRET_KEY is set in .env (see README).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
