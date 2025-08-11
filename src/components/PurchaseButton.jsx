"use client";
import { useUser } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const PurchaseButton = ({ courseId }) => {
  const [isLoading, setisLoading] = useState(false);

  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user
      ? {
          clerkId: user?.id,
        }
      : "skip"
  );
  const userAccess = useQuery(
    api.users.getUserAccess,
    userData
      ? {
          userId: userData._id,
          courseId,
        }
      : "skip"
  ) || { hasAccess: false };

  const handlePurchase = async () => {
    if (!user) toast.error("Please log in to purchase");
    setisLoading(true);
    try {
      const { checkoutUrl } = await createCheckoutSession({ courseId });
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("failed to create checkout session");
      }
    } catch (err) {
      // to do : handle error herr
      if (err.message.includes("rate limit exceeded")) {
        toast.error("rate limit exceeded , please try again later");
      } else {
        toast.error(
          err.message || "some thing went wrong please try again later"
        );
      }
      console.log("errror from purchase button ");
    }
  };

  if (!userAccess.hasAccess) {
    return (
      <Button variant={"outline"} onClick={handlePurchase} disabled={isLoading}>
        enroll now{" "}
      </Button>
    );
  }
  if (userAccess.hasAccess) {
    return <Button variant="outline">enrolled</Button>;
  }
  if (isLoading) {
    return (
      <Button variant="outline">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        proccessing
      </Button>
    );
  }
};

export default PurchaseButton;
