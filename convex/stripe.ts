import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import stripe from "../src/lib/stripe";
import ratelimit from "../src/lib/ratelimit";

type CreateCheckoutArgs = {
  courseId: Id<"courses">;
};

type UserType = {
  _id: string;
  stripeCustomerId: string;
};

type CourseType = {
  title: string;
  imageUrl: string;
  price: number;
};

export const createCheckoutSession = action({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (
    ctx,
    args: CreateCheckoutArgs
  ): Promise<{ checkoutUrl: string }> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("unauthorized");
    }

    const user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    })) as UserType | null;

    if (!user) {
      throw new ConvexError("user not found");
    }

    // rate limiting
    const rateLimitKey = `checkout-rate-limit:${user._id}`;
    const { success, reset } = await ratelimit.limit(rateLimitKey);
    if (!success) {
      throw new ConvexError(
        `rate limit exceeded, please wait for ${Math.ceil((reset - Date.now()) / 1000)} seconds`
      );
    }

    const course = (await ctx.runQuery(api.courses.getCourseById, {
      courseId: args.courseId,
    })) as CourseType | null;

    if (!course) {
      throw new ConvexError(
        "item not found"
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              images: [course.imageUrl],
            },
            // Stripe needs an integer amount in cents; 10.1 * 100 is not an integer.
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${args.courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses`,
      metadata: {
        userId: user._id,
        courseId: args.courseId,
      },
    });

    return { checkoutUrl: session.url! };
  },
});

const PRO_PRICE_ENV = {
  month: "STRIPE_PRICE_ID_MONTHLY",
  year: "STRIPE_PRICE_ID_YEARLY",
} as const;

export const createProPlanCheckoutSession = action({
  args: {
    planId: v.union(v.literal("month"), v.literal("year")),
  },
  handler: async (ctx, args): Promise<{ checkoutUrl: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("unauthorized");
    }

    const user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    })) as UserType | null;
    if (!user) {
      throw new ConvexError("user not found");
    }

    const { success, reset } = await ratelimit.limit(
      `pro-checkout-rate-limit:${user._id}`
    );
    if (!success) {
      throw new ConvexError(
        `rate limit exceeded, please wait for ${Math.ceil((reset - Date.now()) / 1000)} seconds`
      );
    }

    const priceId = process.env[PRO_PRICE_ENV[args.planId]];
    if (!priceId) {
      throw new ConvexError(`${PRO_PRICE_ENV[args.planId]} is not configured`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro/success?year=${args.planId === "year"}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro`,
    });

    return { checkoutUrl: session.url! };
  },
});
