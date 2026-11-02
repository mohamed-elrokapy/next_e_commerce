import React, { Suspense } from "react";
import SuccessPageClient from "./SuccessPageClient";

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-muted-foreground">Loading...</p>}>
      <SuccessPageClient />
    </Suspense>
  );
}
