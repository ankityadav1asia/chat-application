import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Send a new message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now(),
      isDeleted: false,
      reactions: [],
    });

    // Update conversation with last message
    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      lastMessageTime: Date.now(),
      lastMessageContent: args.content,
    });

    return messageId;
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();

    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          sender,
        };
      })
    );

    return messagesWithSenders;
  },
});

// Delete message (soft delete)
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      isDeleted: true,
      content: "This message was deleted",
    });
  },
});

// Add reaction to message
export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return;

    const reactions = message.reactions || [];
    const existingIndex = reactions.findIndex(
      r => r.userId === args.userId && r.emoji === args.emoji
    );

    if (existingIndex >= 0) {
      reactions.splice(existingIndex, 1); // Remove reaction
    } else {
      reactions.push({ userId: args.userId, emoji: args.emoji }); // Add reaction
    }

    await ctx.db.patch(args.messageId, { reactions });
  },
});