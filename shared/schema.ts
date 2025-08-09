
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").notNull().default(100),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const generatedImages = pgTable("generated_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  stylePreset: text("style_preset"),
  imageUrl: text("image_url").notNull(),
  width: integer("width"),
  height: integer("height"),
  steps: integer("steps"),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true,
});

// @shared/schema/index.ts or similar
export interface GenerateImageRequest {
  prompt: string;
  numImages: number;
  steps: number;
  height: number;
  width: number;
  model:
    | "black-forest-labs/FLUX.1-schnell"
    | "stabilityai/stable-diffusion-xl-base-1.0"
    | "ByteDance/SDXL-Lighting"
    | "darkstorm2150/Protogen_x3.4_Official_Release"
    | "xinsir/controller-union-sdxl-1.0"
    | string; // Add other model types as needed
  cfgScale: number;
  stylePreset?: "auto" | "dynamic" | "photorealistic" | "artistic" | "anime" | "sci-fi" | "fantasy" | "horror" | "comic" | "retro" | "minimalist" | "modern" | "vintage" | "futuristic";
  negativePrompt?: string; // Add this line
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
