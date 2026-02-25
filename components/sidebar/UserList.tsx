"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

interface UserListProps {
  currentUserId: string;
  searchTerm: string;
  onStartConversation: (conversationId: string) => void;
}

export function UserList({ currentUserId, searchTerm, onStartConversation }: UserListProps) {
  const users = useQuery(api.users.getAllUsers);
  const createConversation = useMutation(api.conversations.createOrGetConversation);

  // Loading state
  if (users === undefined) {
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

  // Filter out current user and apply search
  const filteredUsers = users
    .filter(user => user._id !== currentUserId)
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleStartConversation = async (otherUserId: string) => {
    try {
      const conversationId = await createConversation({
        participantIds: [currentUserId as any, otherUserId as any],
        isGroup: false,
      });
      onStartConversation(conversationId);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Empty state
  if (filteredUsers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No users found</p>
        <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-3 p-4 hover:bg-gray-50"
        >
          <div className="relative">
            <Avatar>
              <AvatarFallback className="bg-gray-500 text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          
          <Button
            size="sm"
            onClick={() => handleStartConversation(user._id)}
          >
            Message
          </Button>
        </div>
      ))}
    </div>
  );
}