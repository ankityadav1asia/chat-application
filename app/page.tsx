import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await currentUser();

  // If already signed in, redirect to chat
  if (user) {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Real-Time Chat Application
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with friends and colleagues instantly. Built with Next.js, Convex, and Clerk.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}