"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface ChatAreaProps {
  conversationId: string;
}

export function ChatArea({ conversationId }: ChatAreaProps) {
  const { user } = useUser();
  
  // Get Convex user
  const convexUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  // Fetch conversation details
  const conversation = useQuery(api.conversations.getConversation, {
    conversationId: conversationId as any,
  });

  // Get the other user in the conversation
  const otherParticipantId = conversation?.participants?.find(
    (id: any) => convexUser && id !== convexUser._id
  );
  
  // Fetch other user details
  const otherUser = useQuery(api.users.getUser, {
    userId: otherParticipantId as any,
  });

  // Loading state
  if (conversation === undefined || otherUser === undefined || !convexUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // If conversation or user not found
  if (!conversation || !otherUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Conversation not found</p>
          <p className="text-sm text-gray-400">Please select another chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3 bg-white shadow-sm">
        <div className="relative">
          <Avatar>
            <AvatarFallback className="bg-blue-500 text-white">
              {getInitials(otherUser.name)}
            </AvatarFallback>
          </Avatar>
          {otherUser.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
          <p className="text-xs">
            {otherUser.isOnline ? (
              <span className="text-green-600">Online</span>
            ) : (
              <span className="text-gray-400">
                Last seen {new Date(otherUser.lastSeen).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <MessageList 
        conversationId={conversationId} 
        currentUserId={convexUser._id} 
      />
      
      {/* Typing Indicator */}
      <TypingIndicator 
        conversationId={conversationId} 
        currentUserId={convexUser._id} 
      />
      
      {/* Input */}
      <ChatInput 
        conversationId={conversationId} 
        senderId={convexUser._id} 
      />
    </div>
  );
}