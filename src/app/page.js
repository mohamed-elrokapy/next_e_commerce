import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog } from "../lib/catalog";
import ItemCard from "../components/ItemCard";
import ItemImage from "../components/ItemImage";
import SampleNotice from "../components/SampleNotice";
import { Button } from "../components/ui/button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, source } = await getCatalog();
  const purchasable = source === "convex";
  const featured = items.slice(0, 3);
  const [heroA, heroB] = items;

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.25fr_1fr] md:py-20">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Pancakes and waffles
          </p>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            When you are home,
            <br />
            <em className="font-normal text-primary">find your best taste.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Well-made food, picked from a short menu. Choose a plate and pay
            securely at checkout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/courses">
                Browse the menu
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {heroA && (
          <div className="relative mx-auto w-full max-w-md pb-10 md:max-w-none">
            <ItemImage
              src={heroA.imageUrl}
              alt={heroA.title}
              priority
              ratio="aspect-[5/4]"
              sizes="(min-width: 768px) 40vw, 90vw"
              className="rounded-2xl border shadow-md"
            />
            {heroB && (
              <ItemImage
                src={heroB.imageUrl}
                alt={heroB.title}
                ratio="aspect-square"
                sizes="30vw"
                className="absolute -bottom-0 -left-2 w-2/5 rounded-xl border-4 border-background shadow-md sm:-left-6"
              />
            )}
          </div>
        )}
      </section>

      <section
        aria-labelledby="menu-heading"
        className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {!purchasable && <SampleNotice />}
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2
            id="menu-heading"
            className="font-display text-3xl font-medium tracking-tight">
            From the menu
          </h2>
          <Link
            href="/courses"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            See all {items.length} items
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            The menu is empty right now. Please check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                purchasable={purchasable}
                priority={i === 0}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
