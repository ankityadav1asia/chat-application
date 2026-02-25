import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set typing status
export const setTypingStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existingList = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
    
    const existing = existingList.find(status => status.userId === args.userId);

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("typingStatus", {
        conversationId: args.conversationId,
        userId: args.userId,
        isTyping: args.isTyping,
        lastUpdated: Date.now(),
      });
    }
  },
});

// Get typing users in a conversation
export const getTypingStatus = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const fiveSecondsAgo = Date.now() - 5000;
    
    const typingStatuses = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
    
    const activeTyping = typingStatuses.filter(
      status => status.isTyping === true && status.lastUpdated > fiveSecondsAgo
    );

    const usersWithDetails = await Promise.all(
      activeTyping.map(async (status) => {
        const user = await ctx.db.get(status.userId);
        return user;
      })
    );

    return usersWithDetails.filter((user) => user !== null);
  },
});

// Clean up old typing statuses
export const cleanOldTypingStatuses = mutation({
  handler: async (ctx) => {
    const fiveSecondsAgo = Date.now() - 5000;
    
    const oldStatuses = await ctx.db
      .query("typingStatus")
      .filter((q) => q.lt(q.field("lastUpdated"), fiveSecondsAgo))
      .collect();
    
    await Promise.all(
      oldStatuses.map(async (status) => {
        await ctx.db.delete(status._id);
      })
    );
    
    return oldStatuses.length;
  },
});