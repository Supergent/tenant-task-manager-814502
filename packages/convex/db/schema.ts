import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
