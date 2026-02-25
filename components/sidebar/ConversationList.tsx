"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationItem } from "./ConversationItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  userId: string;
  searchTerm: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({ userId, searchTerm, onSelectConversation }: ConversationListProps) {
  const conversations = useQuery(api.conversations.getUserConversations, {
    userId: userId as any,
  });

  // Loading state
  if (conversations === undefined) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter conversations based on search
  const filteredConversations = conversations?.filter(conv => 
    conv.otherUsers[0]?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Empty state
  if (filteredConversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No conversations found</p>
        <p className="text-sm text-gray-400 mt-1">Start a new chat from Users tab</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {filteredConversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
          onSelect={() => onSelectConversation(conversation._id)}
        />
      ))}
    </div>
  );
}