"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  conversationId: string;
  senderId: string;
}

export function ChatInput({ conversationId, senderId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTypingStatus = useMutation(api.typing.setTypingStatus);

  useEffect(() => {
    // Handle typing indicator
    if (message.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        setTypingStatus({
          conversationId: conversationId as any,
          userId: senderId as any,
          isTyping: true,
        });
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingStatus({
          conversationId: conversationId as any,
          userId: senderId as any,
          isTyping: false,
        });
      }, 2000);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Ensure typing is set to false when component unmounts
      setTypingStatus({
        conversationId: conversationId as any,
        userId: senderId as any,
        isTyping: false,
      });
    };
  }, [message, conversationId, senderId, setTypingStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        conversationId: conversationId as any,
        senderId: senderId as any,
        content: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="flex gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!message.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}