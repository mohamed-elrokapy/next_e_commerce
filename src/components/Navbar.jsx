import {
  SignedIn,
  SignedOut,
  SignOutButton,
  SignInButton,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";
import {
  BookOpenIcon,
  CreditCardIcon,
  LogOutIcon,
  SatelliteDish,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <section className="flex justify-between items-center py-4 bg-background border-b     ">
      <Link
        href={"/"}
        className="text-xl font-extrabold text-primary flex items-center gap-2">
        F_O_O_D_A_T_Y <SatelliteDish className="size-6" />
      </Link>
      <div className="flex items-center space-x-1 sm:space-x-4">
        <Link
          href={"/courses"}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors ">
          <BookOpenIcon className="size-4" />
          <span className="hidden sm:inline ">courses</span>
        </Link>
        <Link
          href={"/pro"}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors ">
          <ZapIcon className="size-4" />
          <span className="hidden sm:inline ">pro</span>
        </Link>
        <Link
          href={"/courses"}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors ">
          <BookOpenIcon className="size-4" />
          <span className="hidden sm:inline ">courses</span>
        </Link>
        <SignedIn>
          {" "}
          <Link href={"/billing"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center gap-2">
              <CreditCardIcon className="size-4" />
              <span className="hidden sm:inline"> Billing</span>
            </Button>
          </Link>
        </SignedIn>

        <UserButton />

        <SignedIn>
          <SignOutButton>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center gap-2">
              <LogOutIcon className="size-4" />
              <span className="hidden sm:inline"> log out</span>
            </Button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center gap-2">
              <LogOutIcon className="size-4" />
              <span className="hidden sm:inline"> log in</span>
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedOut>
          <SignUpButton mode="modal">
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center gap-2">
              <LogOutIcon className="size-4" />
              <span className="hidden sm:inline"> sign up</span>
            </Button>
          </SignUpButton>
        </SignedOut>
        {/* <SignedOut> i am signed out</SignedOut> */}
      </div>
    </section>
  );
};

export default Navbar;
