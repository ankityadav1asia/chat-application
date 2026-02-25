"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";
import { MoreHorizontal, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👎"];

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const addReaction = useMutation(api.messages.addReaction);

  const handleDelete = () => {
    deleteMessage({ messageId: message._id });
  };

  const handleReaction = (emoji: string) => {
    addReaction({
      messageId: message._id,
      userId: message.senderId, // This will be updated with current user ID
      emoji,
    });
  };

  const getReactionCounts = () => {
    const counts: Record<string, number> = {};
    message.reactions?.forEach((r: any) => {
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
    });
    return counts;
  };

  const reactionCounts = getReactionCounts();

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div 
        className={`relative group max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {!isOwn && message.sender && (
          <p className="text-xs text-gray-500 mb-1 ml-2">{message.sender.name}</p>
        )}
        
        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
          }`}
        >
          {message.isDeleted ? (
            <p className="italic text-sm text-gray-400">This message was deleted</p>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              
              {/* Reactions */}
              {Object.keys(reactionCounts).length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {Object.entries(reactionCounts).map(([emoji, count]) => (
                    <span 
                      key={emoji} 
                      className={`text-xs rounded-full px-1.5 py-0.5 ${
                        isOwn ? "bg-blue-600" : "bg-gray-100"
                      }`}
                    >
                      {emoji} {count}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
          
          <p className={`text-xs mt-1 ${
            isOwn ? "text-blue-100" : "text-gray-400"
          }`}>
            {formatDate(message.timestamp)}
          </p>

          {/* Message Actions */}
          {showActions && !message.isDeleted && (
            <div className={`absolute top-0 ${isOwn ? "left-0" : "right-0"} -translate-y-full mb-1 flex gap-1 bg-white rounded-lg shadow-lg p-1`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Smile className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="flex gap-1 p-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="hover:bg-gray-100 p-1 rounded text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {isOwn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}