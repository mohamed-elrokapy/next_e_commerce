"use client";

import { useQuery } from "convex/react";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "../../../components/ui/skeleton";
import ItemImage from "../../../components/ItemImage";
import PurchaseButton from "../../../components/PurchaseButton";
import { cleanTitle, formatPrice } from "../../../lib/catalog";

const OneCourse = ({ params }) => {
  const { courseid } = React.use(params);

  const { isLoaded } = useUser();
  const courseData = useQuery(
    api.courses.getCourseById,
    courseid ? { courseId: courseid } : "skip"
  );

  if (!isLoaded || courseData === undefined) {
    return <ItemDetailSkeleton />;
  }

  if (courseData === null) return notFound();

  const title = cleanTitle(courseData.title);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to the menu
      </Link>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ItemImage
          src={courseData.imageUrl}
          alt={title}
          priority
          ratio="aspect-[4/3]"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="rounded-2xl border shadow-sm"
        />
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-4xl font-medium leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {courseData.description}
          </p>
          <p className="mt-6 font-display text-3xl">
            {formatPrice(courseData.price)}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PurchaseButton courseId={courseid} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneCourse;

function ItemDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6"
      role="status"
      aria-label="Loading">
      <Skeleton className="mb-6 h-5 w-36" />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <div className="flex flex-col justify-center gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-4 h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
