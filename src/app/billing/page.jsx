"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const BillingPage = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );

  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
    userData ? { userId: userData?._id } : "skip"
  );

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-billing-portal", {
        method: "POST",
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
      else throw new Error("Failed to create billing portal");
    } catch (error) {
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    // Convert Unix timestamp (seconds) to milliseconds
    const date = new Date(timestamp * 1000);

    // Format options for consistent date display
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  };

  if (!userData || subscription === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-center font-display text-4xl font-medium tracking-tight">
        Billing Management
      </h1>
      <Card className="w-full overflow-hidden">
        {subscription ? (
          <>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2 font-display text-2xl font-medium">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Active Subscription
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your subscription details below
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4 bg-secondary p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {subscription.planType}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {subscription.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Next billing date
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center bg-accent p-4 rounded-lg text-accent-foreground">
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    Your subscription will be cancelled at the end of the
                    current billing period.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="mt-6 flex justify-end bg-secondary">
              <Button
                onClick={handleManageBilling}
                disabled={isLoading}
                >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Manage Billing"
                )}
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
                        <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl font-medium">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                No Active Subscription
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Upgrade to Pro to unlock premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <p className="mb-6 text-lg">
                Get access to exclusive content and features with our Pro plan.
              </p>
              <Link href="/pro">
                <Button size="lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Pro Plans
                </Button>
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
export default BillingPage;
