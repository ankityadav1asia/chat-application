import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    lastSeen: v.number(),
    isOnline: v.boolean(),
  }).index("by_clerkId", ["clerkId"]),

  conversations: defineTable({
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    lastMessageId: v.optional(v.id("messages")),
    lastMessageTime: v.optional(v.number()),
    lastMessageContent: v.optional(v.string()),
  }).index("by_participants", ["participants"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    timestamp: v.number(),
    isDeleted: v.boolean(),
    reactions: v.optional(v.array(v.object({
      userId: v.id("users"),
      emoji: v.string(),
    }))),
  }).index("by_conversation", ["conversationId", "timestamp"]),

  typingStatus: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
    lastUpdated: v.number(),
  }).index("by_conversation", ["conversationId"]),
});