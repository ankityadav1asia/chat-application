import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If not signed in, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-screen flex flex-col">
      {children}
    </div>
  );
}