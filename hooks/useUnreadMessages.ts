import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UseUnreadMessagesProps {
  conversationId: string;
  userId: string;
}

export function useUnreadMessages({ conversationId, userId }: UseUnreadMessagesProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Get all messages for this conversation
  const messages = useQuery(api.messages.getMessages, {
    conversationId: conversationId as any,
  });

  // In a real app, you'd store last read timestamp per user
  // This is a simplified version
  useEffect(() => {
    if (!messages) return;

    // Get last read timestamp from localStorage (temporary solution)
    const lastReadKey = `last_read_${conversationId}_${userId}`;
    const lastReadStr = localStorage.getItem(lastReadKey);
    const lastRead = lastReadStr ? parseInt(lastReadStr) : 0;

    // Count messages after last read that aren't from current user
    const unread = messages.filter(
      msg => msg.timestamp > lastRead && msg.senderId !== userId
    ).length;

    setUnreadCount(unread);
  }, [messages, conversationId, userId]);

  const markAsRead = () => {
    const lastReadKey = `last_read_${conversationId}_${userId}`;
    localStorage.setItem(lastReadKey, Date.now().toString());
    setUnreadCount(0);
  };

  return {
    unreadCount,
    markAsRead,
  };
}