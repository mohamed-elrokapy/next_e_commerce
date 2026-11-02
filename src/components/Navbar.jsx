import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const navLink =
  "rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/"
            className="mr-1 rounded-md font-display text-2xl font-semibold tracking-tight text-primary sm:mr-4">
            Foodaty
          </Link>
          <Link href="/courses" className={navLink}>
            Menu
          </Link>
          <Link href="/pro" className={navLink}>
            Pro
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <SignedIn>
            <Link href="/billing" className={navLink}>
              Billing
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign up</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
