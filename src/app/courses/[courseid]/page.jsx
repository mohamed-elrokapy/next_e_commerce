// "use client";
// import { useQuery } from "convex/react";
// import React from "react";
// import { api } from "../../../../convex/_generated/api";
// import { notFound } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Skeleton } from "../../../components/ui/skeleton";
// import { useUser } from "@clerk/nextjs";
// import Image from "next/image";
// import PurchaseButton from "../../../components/PurchaseButton";
// import { Lock } from "lucide-react";

// const OneCourse = ({ params }) => {
//   console.log(params, "mohamed");
//   const { courseid } = React.use(params);

//   const { user, isLoaded } = useUser();
//   const userData = useQuery(api.users.getUserByClerkId, {
//     clerkId: user?.id ?? "",
//   });

//   const courseData = courseid
//     ? useQuery(api.courses.getCourseById, { courseId: courseid })
//     : undefined;

//   const userAccess =
//     courseid && userData?._id
//       ? useQuery(api.users.getUserAccess, {
//           courseId: courseid,
//           userId: userData._id,
//         })
//       : { hasAccess: false };

//   if (!isLoaded || courseData === undefined) {
//     return <CourseDatailSkeleton />;
//   }
//   if (courseData === null) return notFound();
//   return (
//     <div className="container mx-auto py-8 px-4">
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <Image
//             src={courseData.imageUrl}
//             alt={courseData.title}
//             width={1200}
//             height={600}
//             className="rounded-md object-cover w-full"
//           />
//         </CardHeader>
//         <CardContent>
//           <CardTitle className="mb-4 text-xl">{courseData.title}</CardTitle>

//           {userAccess.hasAccess ? (
//             <>
//               <p className="text-gray-600 mb-6">{courseData.description}</p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 <Button className="flex items-center justify-center space-x-2">
//                   <PlayCircle className="w-5 h-5" />
//                   <span>Start Course</span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="flex items-center justify-center space-x-2">
//                   <Download className="w-5 h-5" />
//                   <span>Download Materials</span>
//                 </Button>
//               </div>
//               <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
//               <ul className="space-y-2">
//                 <li className="flex items-center space-x-2">
//                   <FileTextIcon className="size-5 text-gray-400" />
//                   <span>Introduction to Advanced Patterns</span>
//                 </li>
//                 <li className="flex items-center space-x-2">
//                   <FileText className="w-5 h-5 text-gray-400" />
//                   <span>Hooks and Custom Hooks</span>
//                 </li>
//               </ul>
//             </>
//           ) : (
//             <div className="text-center">
//               <div className="flex flex-col items-center space-y-4">
//                 <Lock className="w-16 h-16 text-gray-400" />
//                 <p className="text-lg text-gray-600">This course is locked.</p>
//                 <p className="text-gray-500 mb-4">
//                   Enroll in this course to access all premium content.
//                 </p>
//                 <p className="text-2xl font-bold mb-4">
//                   ${courseData.price.toFixed(2)}
//                 </p>
//                 <PurchaseButton courseId={params.courseId} />
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OneCourse;

// function CourseDatailSkeleton() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card>
//         <CardHeader>
//           <Skeleton className="w-full h-[600px] rounded-md " />
//         </CardHeader>
//         <CardContent>
//           <Skeleton className={"h-10 w-3/4 mb-4"} />
//           <Skeleton className={"h-4 w-full mb-2"} />
//           <Skeleton className="h-4 w-full mb-2" />
//           <Skeleton className={"h-4 w-2/3 mb-6"} />
//           <div className="grid  grid-col-1 md:grid-col-2 gap-4 mb-8">
//             <Skeleton className={"h-10 w-full"} />
//             <Skeleton className={"h-10 w-full"} />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import PurchaseButton from "../../../components/PurchaseButton";

// أيقونات Lucide
import { Lock, PlayCircle, Download, FileText } from "lucide-react";

const OneCourse = ({ params }) => {
  const { courseid } = React.use(params);

  const { user, isLoaded } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  // استدعاء useQuery دايمًا مع "skip" لو مفيش بيانات
  const courseData = useQuery(
    api.courses.getCourseById,
    courseid ? { courseId: courseid } : "skip"
  );

  const userAccess = useQuery(
    api.users.getUserAccess,
    courseid && userData?._id
      ? { courseId: courseid, userId: userData._id }
      : "skip"
  ) || { hasAccess: false };

  if (!isLoaded || courseData === undefined) {
    return <CourseDetailSkeleton />;
  }

  if (courseData === null) return notFound();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Image
            src={courseData.imageUrl}
            alt={courseData.title}
            width={1200}
            height={600}
            className="rounded-md object-cover w-full"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-4 text-xl">{courseData.title}</CardTitle>

          {userAccess.hasAccess ? (
            <>
              <p className="text-gray-600 mb-6">{courseData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md">
                  <PlayCircle className="w-5 h-5" />
                  <span>Start Course</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border px-4 py-2 rounded-md">
                  <Download className="w-5 h-5" />
                  <span>Download Materials</span>
                </button>
              </div>
              <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span>Introduction to Advanced Patterns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span>Hooks and Custom Hooks</span>
                </li>
              </ul>
            </>
          ) : (
            <div className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <Lock className="w-16 h-16 text-gray-400" />
                <p className="text-lg text-gray-600">This course is locked.</p>
                <p className="text-gray-500 mb-4">
                  Enroll in this course to access all premium content.
                </p>
                <p className="text-2xl font-bold mb-4">
                  ${courseData.price.toFixed(2)}
                </p>
                <PurchaseButton courseId={courseid} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OneCourse;

function CourseDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <Skeleton className="w-full h-[600px] rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
