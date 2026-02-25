"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatTime } from "@/lib/utils";

interface ConversationItemProps {
  conversation: any;
  onSelect: () => void;
}

export function ConversationItem({ conversation, onSelect }: ConversationItemProps) {
  const otherUser = conversation.otherUsers[0];
  const lastMessage = conversation.lastMessage;
  const unreadCount = conversation.unreadCount;

  if (!otherUser) return null;

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors"
    >
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
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">
            {otherUser.name}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 truncate">
            {lastMessage?.content || "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}