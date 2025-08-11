import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  /*************  ✨ Windsurf Command 🌟  *************/
  /**
   * Create a new user.
   *
   * If the user already exists, then return the existing user's ID.
   *
   * @param ctx - The Convex context.
   * @param args - The name, email, Clerk ID, and Stripe customer ID.
   * @returns The ID of the created or existing user.
   */
  handler: async (ctx, args) => {
    // Check if the user already exists.
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      // If the user already exists, then return the existing user's ID.
      console.log("user already exist");
      return existingUser._id;
    }
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      clerkId: args.clerkId,
      stripeCustomerId: args.stripeCustomerId,
    });

    return userId;
  },
  /*******  d2bd3e86-e53c-44e3-94c0-54531a7ca989  *******/
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getUserByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .unique();
  },
});

export const getUserAccess = query({
  args: { userId: v.id("users"), courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("user not found");
    }

    if (user.currentSubscriptionId) {
      const subscription = await ctx.db.get(user.currentSubscriptionId);
      if (subscription && subscription.status === "active") {
        return { hasAccess: true, accessType: "subscription" };
      }
    }

    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();
    if (purchase) {
      return { hasAccess: true, accessType: "course" };
    } else {
      return { hasAccess: false, accessType: "none" };
    }
  },
});
