import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel"; // ✅ استيراد النوع
import stripe from "../src/lib/stripe";
import ratelimit from "../src/lib/ratelimit";

type CreateCheckoutArgs = {
  courseId: Id<"courses">; // ✅ تعديل النوع
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
        `course is not found. try again in ${reset} seconds`
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
            unit_amount: course.price * 100,
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
