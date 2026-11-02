"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Check, Clock, Rocket, Star } from "lucide-react";

const SuccessPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isYearly = useMemo(
    () => searchParams.get("year") === "true",
    [searchParams]
  );

  const benefits = isYearly
    ? [
        "Access to all premium courses for a full year",
        "Save 17% compared to monthly subscription",
        "Priority support",
        "Exclusive yearly member events",
        "Early access to new courses and features",
      ]
    : [
        "Access to all premium courses",
        "Priority support",
        "Exclusive community features",
        "Monthly live Q&A sessions",
      ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16 sm:px-6">
      <Card className="w-full overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isYearly ? (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                <Star className="mr-1 h-5 w-5 text-primary" />
                Yearly Pro
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                <Clock className="mr-1 h-5 w-5 text-primary" />
                Monthly Pro
              </Badge>
            )}
          </div>
          <CardTitle className="mb-2 font-display text-3xl font-medium md:text-4xl">
            Welcome to Pro!
          </CardTitle>
          <CardDescription className="text-lg md:text-xl">
            You&apos;ve successfully subscribed to our{" "}
            {isYearly ? "Yearly" : "Monthly"} Pro plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold">
              Your Pro Benefits:
            </h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 text-sm md:text-base">
                  <Check
                    className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full text-lg"
            size="lg"
            onClick={() => router.push("/courses")}>
            <Rocket className="mr-2 h-5 w-5" /> Start Your Pro Journey
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Excited to get started? Explore your new Pro features now!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPageClient;
