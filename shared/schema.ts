
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

export const generateImageRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt too long"),
  model: z.enum([
    "black-forest-labs/FLUX.1-schnell",
    "stabilityai/stable-diffusion-xl-base-1.0",
    "runwayml/stable-diffusion-v1-5",
    "stabilityai/stable-diffusion-xl-refiner-1.0",
    "CompVis/stable-diffusion-v1-4",
    "stabilityai/stable-diffusion-2-1",
    "stabilityai/sdxl-turbo",
    "ByteDance/SDXL-Lightning",
    "prompthero/openjourney-v4",
    "wavymulder/Analog-Diffusion",
    "diffusers/stable-diffusion-xl-1.0-inpainting-0.1",
    "ByteDance/AnimateDiff-Lightning",
    "xinsir/controlnet-union-sdxl-1.0",
    "darkstorm2150/Protogen_x3.4_Official_Release",
    "John6666/limitless-vision-xl-v30-sdxl",
    "openart-custom/AlbedoBase"
  ]),
  stylePreset: z.enum([
    "auto", "dynamic", "photorealistic", "artistic", "anime", "sci-fi", 
    "fantasy", "horror", "comic", "retro", "minmalist", "modern", 
    "vintage", "futuristic"
  ]).optional(),
  width: z.number().min(256).max(2048).default(512),
  height: z.number().min(256).max(2048).default(512),
  steps: z.number().min(1).max(50).default(4),
  cfgScale: z.number().min(1).max(20).default(1),
  numImages: z.number().min(1).max(4).default(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type GenerateImageRequest = z.infer<typeof generateImageRequestSchema>;
