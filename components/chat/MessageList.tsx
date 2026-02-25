"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

interface MessageListProps {
  conversationId: string;
  currentUserId: string;
}

export function MessageList({ conversationId, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Fetch real messages from Convex
  const messages = useQuery(api.messages.getMessages, {
    conversationId: conversationId as any,
  });

  useEffect(() => {
    // Scroll to bottom on initial load
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isScrolledToBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isScrolledToBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  // Loading state
  if (messages === undefined) {
    return (
      <div className="flex-1 bg-gray-50 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${i % 2 === 0 ? 'order-2' : 'order-1'}`}>
              {i % 2 !== 0 && <Skeleton className="h-4 w-20 mb-1 ml-2" />}
              <Skeleton className={`h-16 w-64 rounded-2xl ${i % 2 === 0 ? 'bg-blue-200' : 'bg-white'}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No messages yet</p>
          <p className="text-sm text-gray-400">Say hello to start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gray-50">
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto p-4"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          New messages
        </Button>
      )}
    </div>
  );
}