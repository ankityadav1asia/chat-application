import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface UseConversationProps {
  conversationId?: string;
  currentUserId: string;
}

export function useConversation({ conversationId, currentUserId }: UseConversationProps) {
  const router = useRouter();
  
  // Get conversation details
  const conversation = useQuery(
    api.conversations.getConversation,
    conversationId ? { conversationId: conversationId as any } : "skip"
  );

  // Get messages
  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId: conversationId as any } : "skip"
  );

  // Get other user
  const otherParticipantId = conversation?.participants?.find(
    (id: any) => id !== currentUserId
  );
  
  const otherUser = useQuery(
    api.users.getUser,
    otherParticipantId ? { userId: otherParticipantId as any } : "skip"
  );

  const sendMessage = useMutation(api.messages.sendMessage);
  const createConversation = useMutation(api.conversations.createOrGetConversation);

  const startConversation = async (otherUserId: string) => {
    try {
      const newConversationId = await createConversation({
        participantIds: [currentUserId as any, otherUserId as any],
        isGroup: false,
      });
      router.push(`/chat/${newConversationId}`);
      return newConversationId;
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;
    
    try {
      await sendMessage({
        conversationId: conversationId as any,
        senderId: currentUserId as any,
        content,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return {
    conversation,
    messages,
    otherUser,
    startConversation,
    sendMessage: handleSendMessage,
    isLoading: conversation === undefined || messages === undefined,
  };
}