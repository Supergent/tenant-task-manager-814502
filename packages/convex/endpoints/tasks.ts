import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { getUserId } from "../db/auth";

// LIST endpoint - Get all tasks for current user
export const list = query({
  args: {},
  handler: async (ctx, args) => {
    await getUserId(ctx);  // REQUIRED: Defense-in-depth auth validation
    return await ctx.runQuery(internal.db.tasks.list, {});
  },
});

// GET endpoint - Get single task by ID
export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await getUserId(ctx);  // REQUIRED: Defense-in-depth auth validation
    return await ctx.runQuery(internal.db.tasks.get, { id: args.id });
  },
});

// CREATE endpoint - Create new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await getUserId(ctx);  // REQUIRED: Defense-in-depth auth validation
    return await ctx.runMutation(internal.db.tasks.create, args);
  },
});

// UPDATE endpoint - Update existing task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await getUserId(ctx);  // REQUIRED: Defense-in-depth auth validation
    return await ctx.runMutation(internal.db.tasks.update, args);
  },
});

// DELETE endpoint - Remove task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await getUserId(ctx);  // REQUIRED: Defense-in-depth auth validation
    return await ctx.runMutation(internal.db.tasks.remove, { id: args.id });
  },
});
