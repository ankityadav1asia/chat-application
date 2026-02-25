import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store user when they sign in via Clerk
export const storeUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        lastSeen: Date.now(),
        isOnline: true,
      });
      return existing._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      ...args,
      lastSeen: Date.now(),
      isOnline: true,
    });
  },
});

// Get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get a single user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Update user online status
export const updateUserStatus = mutation({
  args: {
    userId: v.id("users"),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
    });
  },
});

// Search users by name
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users.filter(user => 
      user.name.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Create test user (for development without Clerk)
export const createTestUser = mutation({
  handler: async (ctx) => {
    const testUser = {
      clerkId: "test_user_1",
      email: "test@example.com",
      name: "Test User",
      lastSeen: Date.now(),
      isOnline: true,
    };
    
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", "test_user_1"))
      .first();
    
    if (!existing) {
      await ctx.db.insert("users", testUser);
      return "Test user created";
    }
    return "Test user already exists";
  },
});