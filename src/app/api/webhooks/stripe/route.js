import Stripe from "stripe";
import stripe from "../../../../lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import resend from "../../../../lib/resend";
import PurchaseConfirmationEmail from "@/emails/PurchaseConfirmationEmail";
import ProPlanActivatedEmail from "@/emails/ProPlanActivatedEmail";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return new Response("Webhook signature verification failed.", {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(event.data.object, event.type);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  } catch (error) {
    console.error(`Error processing webhook (${event.type}):`, error);
    return new Response("Error processing webhook", { status: 400 });
  }

  return new Response(null, { status: 200 });
}

async function handleCheckoutSessionCompleted(session) {
  const courseId = session.metadata?.courseId;
  const stripeCustomerId = session.customer;

  if (!courseId || !stripeCustomerId) {
    throw new Error("Missing courseId or stripeCustomerId");
  }

  const user = await convex.query(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  await convex.mutation(api.purchases.recordPurchase, {
    userId: user._id,
    courseId: courseId,
    amount: session.amount_total,
    stripePurchaseId: session.id,
  });

  //   send email
  if (
    session.metadata &&
    session.metadata.courseTitle &&
    session.metadata.courseImageUrl &&
    process.env.NODE_ENV === "development"
  ) {
    await resend.emails.send({
      from: "MasterClass <onboarding@resend.dev>",
      to: user.email,
      subject: "Purchase Confirmed",
      react: PurchaseConfirmationEmail({
        customerName: user.name,
        courseTitle: session.metadata?.courseTitle,
        courseImage: session.metadata?.courseImageUrl,
        courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`,
        purchaseAmount: session.amount_total / 100,
      }),
    });
  }
}

async function handleSubscriptionUpsert(subscription, eventType) {
  if (subscription.status !== "active" || !subscription.latest_invoice) {
    console.log(
      `Skipping subscription ${subscription.id} - Status: ${subscription.status}`
    );
    return;
  }

  const stripeCustomerId = subscription.customer;
  const user = await convex.query(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });

  if (!user) {
    throw new Error(
      `User not found for stripe customer id: ${stripeCustomerId}`
    );
  }

  try {
    await convex.mutation(api.subscriptions.upsertSubscription, {
      userId: user._id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      planType: subscription.items.data[0].plan.interval,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
    console.log(
      `Successfully processed ${eventType} for subscription ${subscription.id}`
    );

    const isCreation = eventType === "customer.subscription.created";

    if (isCreation && process.env.NODE_ENV === "development") {
      await resend.emails.send({
        from: "MasterClass <onboarding@resend.dev>",
        to: user.email,
        subject: "Welcome to MasterClass Pro!",
        react: ProPlanActivatedEmail({
          name: user.name,
          planType: subscription.items.data[0].plan.interval,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }),
      });
    }
  } catch (error) {
    console.error(
      `Error processing ${eventType} for subscription ${subscription.id}:`,
      error
    );
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    await convex.mutation(api.subscriptions.removeSubscription, {
      stripeSubscriptionId: subscription.id,
    });
    console.log(`Successfully deleted subscription ${subscription.id}`);
  } catch (error) {
    console.error(`Error deleting subscription ${subscription.id}:`, error);
  }
}
