import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const metadata = { title: "Purchase complete" };

const page = async ({ params, searchParams }) => {
  const { courseid } = await params;
  const { session_id } = await searchParams;
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <CheckCircle
        className="mx-auto mb-5 size-14 text-primary"
        aria-hidden="true"
      />
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Purchase complete
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Thank you for your order.
      </p>
      {session_id && (
        <p className="mt-6 break-all rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          Transaction ID: {session_id}
        </p>
      )}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href={`/courses/${courseid}`}>View item</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/courses">Back to the menu</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
