"use server";

import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSessionAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login`);
  }
  const userId = session.user.id;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    redirect("/");
  }

  if (course.instructorId === userId) {
    redirect(`/courses/${course.slug}`);
  }

  const existingPurchase = await prisma.purchase.findUnique({
    where: { studentId_courseId: { studentId: userId, courseId } },
  });

  if (existingPurchase?.status === "PAID") {
    redirect(`/learn/${course.slug}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let checkoutSession: Stripe.Checkout.Session;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: course.priceCents,
            product_data: {
              name: course.title,
              description: course.description.slice(0, 300),
            },
          },
        },
      ],
      metadata: { courseId, userId },
      success_url: `${appUrl}/courses/${course.slug}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/courses/${course.slug}?purchase=cancelled`,
    });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    redirect(`/courses/${course.slug}?purchase=error`);
  }

  await prisma.purchase.upsert({
    where: { studentId_courseId: { studentId: userId, courseId } },
    create: {
      studentId: userId,
      courseId,
      amountCents: course.priceCents,
      stripeSessionId: checkoutSession.id,
      status: "PENDING",
    },
    update: {
      stripeSessionId: checkoutSession.id,
      amountCents: course.priceCents,
      status: "PENDING",
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe no devolvió una URL de checkout");
  }

  redirect(checkoutSession.url);
}

/**
 * Fallback confirmation for local/dev environments where the Stripe webhook
 * isn't reachable. Safe to call repeatedly; the webhook remains the source
 * of truth in production.
 */
export async function confirmCheckoutSessionAction(sessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (checkoutSession.payment_status === "paid") {
    await prisma.purchase.updateMany({
      where: { stripeSessionId: checkoutSession.id },
      data: { status: "PAID" },
    });
  }
}
