import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

import { api } from "./_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";
import stripe from "../src/lib/stripe";

const http = httpRouter();

const clerkWebhook = httpAction(async (ctx, request) => {
  const WebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!WebhookSecret) throw new Error("Clerk Webhook Secret is not set");

  const svix_id = request.headers.get("svix-id");
  const svix_signature = request.headers.get("svix-signature");
  const svix_timestamp = request.headers.get("svix-timestamp");
  if (!svix_id || !svix_signature || !svix_timestamp)
    throw new Error("Missing required headers");

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WebhookSecret);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (err) {
    console.log("error verifying webhook", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // 🟢 Log كامل للـ evt
  console.log("📩 Full Webhook Event:", JSON.stringify(evt, null, 2));

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses?.[0]?.email_address || "";
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    console.log("🛠 Data to send to Convex:", { email, name, clerkId: id });

    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { clerkId: id },
      });

      await ctx.runMutation(api.users.createUser, {
        email,
        name,
        clerkId: id,
        stripeCustomerId: customer.id,
      });

      // send a welcome email
    } catch (err) {
      console.log("error creating user in convex", err);
      return new Response("error creating user", { status: 500 });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

export default http;
