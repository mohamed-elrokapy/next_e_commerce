import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const courses = await convex.query(api.courses.getCourses);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto py-16 px-4">
        <div className="text-center mb-16 ">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 lg:text-5xl">
            when you are home{" "}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto ">
            this is the place that you will find your BEST TASTE ,WELL MADE
            F_O_O_D
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {courses.slice(0, 3).map((course) => (
            <Card key={course._id} className="flex flex-col ">
              <Link href={`/courses/${course._id}`} className="cursor-pointer">
                <CardHeader>
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={640}
                    height={360}
                    className="rounded object-cover w-full h-80"
                  />
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="text-2xl font-bold mb-2 hover:underline ">
                    {" "}
                    {course.title}
                  </CardTitle>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
