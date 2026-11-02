import localFont from "next/font/local";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "./globals.css";
import { ConvexClientProvider } from "../components/providers/ConvexClientProvider";
import Navbar from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: "Foodaty",
    template: "%s | Foodaty",
  },
  description:
    "Foodaty, a pancake and waffle menu. A Next.js, Convex, Clerk and Stripe demo project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <ConvexClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="font-display text-base text-foreground">Foodaty</p>
              <p>A demo project, not a real shop.</p>
            </div>
          </footer>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
