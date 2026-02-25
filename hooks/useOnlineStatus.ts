import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UseOnlineStatusProps {
  userId: string;
}

export function useOnlineStatus({ userId }: UseOnlineStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const updateUserStatus = useMutation(api.users.updateUserStatus);

  useEffect(() => {
    // Set online status when component mounts
    updateUserStatus({
      userId: userId as any,
      isOnline: true,
    });

    // Set offline status when component unmounts
    return () => {
      updateUserStatus({
        userId: userId as any,
        isOnline: false,
      });
    };
  }, [userId, updateUserStatus]);

  // Handle window close/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateUserStatus({
        userId: userId as any,
        isOnline: false,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, updateUserStatus]);

  // Periodic ping to keep online status alive
  useEffect(() => {
    const interval = setInterval(() => {
      updateUserStatus({
        userId: userId as any,
        isOnline: true,
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userId, updateUserStatus]);

  return {
    isOnline,
    setIsOnline,
  };
}