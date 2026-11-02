"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center" role="alert">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 text-muted-foreground">
        The page could not be loaded. Please try again.
      </p>
      <Button className="mt-8" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
