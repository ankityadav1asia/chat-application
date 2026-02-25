"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexUserSync({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isSignedIn && user) {
      storeUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "Unknown",
        avatarUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, storeUser]);

  return <>{children}</>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexUserSync>
        {children}
      </ConvexUserSync>
    </ConvexProvider>
  );
}