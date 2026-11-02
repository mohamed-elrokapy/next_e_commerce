"use client";

import { useUser } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PRO_PLANS } from "../../constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Check, Loader2Icon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ProPage = () => {
  const [loadingPlan, setLoadingPlan] = useState("");
  const { user, isLoaded: isUserLoaded } = useUser();

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );
  const userSubscription = useQuery(
    api.subscriptions.getUserSubscription,
    userData ? { userId: userData?._id } : "skip"
  );

  const isYearlySubscriptionActive =
    userSubscription?.status === "active" &&
    userSubscription.planType === "year";
  const createProPlanCheckoutSession = useAction(
    api.stripe.createProPlanCheckoutSession
  );

  const handlePlanSelection = async (planId) => {
    if (!user) {
      toast.error("Please log in to select a plan.", {
        id: "login-error",
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    setLoadingPlan(planId);
    try {
      const result = await createProPlanCheckoutSession({ planId });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      if (error.message?.toLowerCase().includes("rate limit exceeded")) {
        toast.error("You've tried too many times. Please try again later.");
      } else {
        toast.error(
          "There was an error initiating your purchase. Please try again."
        );
      }
      console.log(error);
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="mb-3 text-center font-display text-4xl font-medium tracking-tight">
        Choose Your Pro Journey
      </h1>
      <p className="mb-12 text-center text-lg text-muted-foreground">
        Unlock premium features and accelerate your learning
      </p>

      {isUserLoaded && userSubscription?.status === "active" && (
        <div className="mb-8 rounded-lg border-l-4 border-primary bg-secondary p-4">
          <p>
            You have an active{" "}
            <span className="font-semibold">{userSubscription.planType}</span>{" "}
            subscription.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {PRO_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`
               flex flex-col transition-shadow duration-300 hover:shadow-md ${
                 plan.highlighted ? "border-primary border-2" : ""
               }
          `}>
            <CardHeader className="flex-grow">
              <CardTitle
                className="font-display text-2xl font-medium">
                {plan.title}
              </CardTitle>

              <CardDescription className="mt-2">
                <span className="font-display text-4xl text-foreground">
                  {plan.price}
                </span>
                <span className="ml-1 text-muted-foreground">{plan.period}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center">
                    <Check
                      className="mr-2 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                size="lg"
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => handlePlanSelection(plan.id)}
                disabled={
                  userSubscription?.status === "active" &&
                  (userSubscription.planType === plan.id ||
                    isYearlySubscriptionActive)
                }>
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : isUserLoaded &&
                  userSubscription?.status === "active" &&
                  userSubscription.planType === plan.id ? (
                  "Current Plan"
                ) : isUserLoaded &&
                  plan.id === "month" &&
                  isYearlySubscriptionActive ? (
                  "Yearly Plan Active"
                ) : (
                  plan.ctaText
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProPage;
