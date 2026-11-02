import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ItemImage from "./ItemImage";
import PurchaseButton from "./PurchaseButton";
import { Button } from "./ui/button";
import { formatPrice } from "../lib/catalog";

/**
 * One menu item. `purchasable` is false when the catalog came from the
 * bundled sample data (no Convex ids, so no detail page or checkout).
 */
export default function ItemCard({ item, purchasable, priority = false }) {
  const body = (
    <>
      <ItemImage
        src={item.imageUrl}
        alt={item.title}
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="rounded-t-xl"
      />
      <div className="px-5 pt-4">
        <h3 className="font-display text-xl font-medium leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>
      </div>
    </>
  );

  return (
    <article className="group flex flex-col rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {purchasable ? (
        <Link
          href={`/courses/${item.id}`}
          className="rounded-t-xl focus-visible:ring-offset-0">
          {body}
        </Link>
      ) : (
        <div>{body}</div>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-5 pt-4">
        <p className="font-display text-2xl">{formatPrice(item.price)}</p>
        {purchasable ? (
          <>
            <SignedIn>
              <PurchaseButton courseId={item.id} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Buy</Button>
              </SignInButton>
            </SignedOut>
          </>
        ) : (
          <Button disabled aria-describedby="sample-notice">
            Buy
          </Button>
        )}
      </div>
    </article>
  );
}
