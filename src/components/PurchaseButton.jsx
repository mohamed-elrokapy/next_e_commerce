"use client";
import { useUser } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Check, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const PurchaseButton = ({ courseId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );
  const userAccess = useQuery(
    api.users.getUserAccess,
    userData ? { userId: userData._id, courseId } : "skip"
  ) || { hasAccess: false };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please log in to buy");
      return;
    }
    setIsLoading(true);
    try {
      const { checkoutUrl } = await createCheckoutSession({ courseId });
      if (!checkoutUrl) throw new Error("Failed to create checkout session");
      window.location.href = checkoutUrl;
    } catch (err) {
      if (err.message?.toLowerCase().includes("rate limit exceeded")) {
        toast.error("Too many attempts. Please try again in a minute.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.error("Checkout failed:", err);
      setIsLoading(false);
    }
  };

  if (userAccess.hasAccess) {
    return (
      <Button variant="outline" disabled>
        <Check aria-hidden="true" />
        Purchased
      </Button>
    );
  }

  return (
    <Button onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin" aria-hidden="true" />
          Processing
        </>
      ) : (
        "Buy"
      )}
    </Button>
  );
};

export default PurchaseButton;
