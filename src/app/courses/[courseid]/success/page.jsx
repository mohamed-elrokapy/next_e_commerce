import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../../../../components/ui/button";

const page = async ({ params, searchParams }) => {
  const { courseid } = await params;
  const { session_id } = await searchParams;
  return (
    <div className="container mx-auto py-12 px-4 ">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className=" size-16 text-green-500 mx-auto mb-4 " />
          <CardTitle className="text-3xl font-bold text-green-700">
            purchase successfull
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-xl text-gray-600">
            thank you for enrolling our course. your journey begins now !{" "}
          </p>
          <div className="bg-gray-100 p-4 rounded-md ">
            <p className="text-sm text-gray-500">
              Transaction Id : {session_id}
            </p>
          </div>
          <Link href={`/courses/${courseid}`}>
            <Button className="w-full sm:w-auto items-center justify-center">
              go to course{" "}
            </Button>
          </Link>

          <Link href={"/courses"}>
            <Button variant="outlin e" className="w-full sm:w-auto ">
              explore our courses{" "}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
