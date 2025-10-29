/**
 * Schema Re-Export
 *
 * Convex codegen expects schema.ts at the root of the convex directory.
 * This file re-exports the schema from our layered db/ directory.
 */

export { default } from "./db/schema";
