import Link from "next/link";
import { Button } from "../components/ui/button";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        We could not find that page
      </h1>
      <p className="mt-3 text-muted-foreground">
        It may have moved, or the item is no longer on the menu.
      </p>
      <Button asChild className="mt-8">
        <Link href="/courses">Back to the menu</Link>
      </Button>
    </div>
  );
}
