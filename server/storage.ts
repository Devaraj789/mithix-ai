import {
  type User,
  type InsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(id: string, credits: number): Promise<void>;

  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
  getGeneratedImagesByUser(userId: string): Promise<GeneratedImage[]>;
  getGeneratedImage(id: string): Promise<GeneratedImage | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private generatedImages: Map<string, GeneratedImage>;

  constructor() {
    this.users = new Map();
    this.generatedImages = new Map();

    // Create a default user for demo purposes
    const defaultUser: User = {
      id: "default-user",
      username: "demo",
      password: "demo",
      credits: 100,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      credits: 100,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(id: string, credits: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.credits = credits;
      this.users.set(id, user);
    }
  }

  async createGeneratedImage(
    insertImage: InsertGeneratedImage,
  ): Promise<GeneratedImage> {
    const id = randomUUID();
    const image: GeneratedImage = {
      ...insertImage,
      id,
      stylePreset: insertImage.stylePreset ?? null,
      userId: insertImage.userId ?? null,
      settings: insertImage.settings ?? null,
      createdAt: new Date(),
    };
    this.generatedImages.set(id, image);
    return image;
  }

  async getGeneratedImagesByUser(userId: string): Promise<GeneratedImage[]> {
    return Array.from(this.generatedImages.values())
      .filter((image) => image.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getGeneratedImage(id: string): Promise<GeneratedImage | undefined> {
    return this.generatedImages.get(id);
  }
}

export const storage = new MemStorage();
