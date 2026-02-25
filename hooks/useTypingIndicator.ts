import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UseTypingIndicatorProps {
  conversationId: string;
  userId: string;
}

export function useTypingIndicator({ conversationId, userId }: UseTypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setTypingStatus = useMutation(api.typing.setTypingStatus);

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTypingStatus({
        conversationId: conversationId as any,
        userId: userId as any,
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
        userId: userId as any,
        isTyping: false,
      });
    }, 2000);
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setTypingStatus({
      conversationId: conversationId as any,
      userId: userId as any,
      isTyping: false,
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTypingStatus({
        conversationId: conversationId as any,
        userId: userId as any,
        isTyping: false,
      });
    };
  }, [conversationId, userId, setTypingStatus]);

  return {
    isTyping,
    startTyping,
    stopTyping,
  };
}