import Link from "next/link";
import { getCatalog, sortItems } from "../../lib/catalog";
import ItemCard from "../../components/ItemCard";
import SampleNotice from "../../components/SampleNotice";
import { cn } from "../../lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Menu" };

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

const page = async ({ searchParams }) => {
  const { sort = "featured" } = await searchParams;
  const { items, source } = await getCatalog();
  const purchasable = source === "convex";
  const sorted = sortItems(items, sort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">
            Menu
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <nav aria-label="Sort menu">
          <ul className="flex flex-wrap gap-2">
            {SORTS.map((s) => {
              const active = (SORTS.some((x) => x.value === sort) ? sort : "featured") === s.value;
              return (
                <li key={s.value}>
                  <Link
                    href={s.value === "featured" ? "/courses" : `/courses?sort=${s.value}`}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    )}>
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {!purchasable && <SampleNotice />}

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          The menu is empty right now. Please check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              purchasable={purchasable}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default page;
