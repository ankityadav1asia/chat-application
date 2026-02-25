"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TypingIndicatorProps {
  conversationId: string;
  currentUserId: string;
}

export function TypingIndicator({ conversationId, currentUserId }: TypingIndicatorProps) {
  const typingUsers = useQuery(api.typing.getTypingStatus, {
    conversationId: conversationId as any,
  });

  // Handle loading state
  if (typingUsers === undefined) return null;

  // Filter out current user and null values
  const otherTypingUsers = (typingUsers || [])
    .filter((user: any) => user !== null && user !== undefined)
    .filter((user: any) => user._id !== currentUserId);

  if (otherTypingUsers.length === 0) return null;

  const getTypingText = (): string => {
    if (otherTypingUsers.length === 1) {
      const user = otherTypingUsers[0];
      const name = user?.name || "Someone";
      return `${name} is typing...`;
    }
    return "Multiple people are typing...";
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="italic">{getTypingText()}</span>
        <div className="flex gap-1">
          <span 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
            style={{ animationDelay: "0ms" }} 
          />
          <span 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
            style={{ animationDelay: "150ms" }} 
          />
          <span 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
            style={{ animationDelay: "300ms" }} 
          />
        </div>
      </div>
    </div>
  );
}