import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or get existing conversation
export const createOrGetConversation = mutation({
  args: {
    participantIds: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // For direct messages (2 people), check if conversation exists
    if (!args.isGroup && args.participantIds.length === 2) {
      const allConversations = await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("isGroup"), false))
        .collect();
      
      const existing = allConversations.find(conv => {
        const participants = conv.participants;
        return participants.length === 2 &&
               participants.includes(args.participantIds[0]) &&
               participants.includes(args.participantIds[1]);
      });

      if (existing) return existing._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      participants: args.participantIds,
      isGroup: args.isGroup,
      groupName: args.groupName,
      lastMessageTime: Date.now(),
    });

    return conversationId;
  },
});

// Get user's conversations
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const allConversations = await ctx.db
      .query("conversations")
      .collect();
    
    const conversations = allConversations
      .filter(conv => conv.participants.includes(args.userId))
      .sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipants = conv.participants.filter(id => id !== args.userId);
        const otherUsers = await Promise.all(
          otherParticipants.map(id => ctx.db.get(id))
        );

        let lastMessage = null;
        if (conv.lastMessageId) {
          lastMessage = await ctx.db.get(conv.lastMessageId);
        }

        // Get unread count
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();
        
        // In a real app, you'd track last seen time per user
        // For now, just return 0
        const unreadCount = 0;

        return {
          ...conv,
          otherUsers,
          lastMessage,
          unreadCount,
        };
      })
    );

    return conversationsWithDetails;
  },
});

// Get single conversation
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});