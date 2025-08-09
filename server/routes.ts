import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateImageRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user credits
  app.get("/api/user/:id/credits", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ credits: user.credits });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's generated images
  app.get("/api/user/:id/images", async (req, res) => {
    try {
      const images = await storage.getGeneratedImagesByUser(req.params.id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate image using Hugging Face API
  app.post("/api/generate-image", async (req, res) => {
    try {
      const requestData = generateImageRequestSchema.parse(req.body);
      const userId = req.body.userId || "default-user";

      // Check user credits
      const user = await storage.getUser(userId);
      const creditsNeeded = (requestData.numImages || 1) * 
        (requestData.model === "black-forest-labs/FLUX.1-schnell" ? 2 : 5);

      if (!user || user.credits < creditsNeeded) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      // Call Hugging Face API
      const hfApiKey = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
      if (!hfApiKey) {
        return res.status(500).json({ message: "Hugging Face API key not configured. Please add your API key to environment variables." });
      }

      console.log(`Generating image with model: ${requestData.model}`);
      console.log(`Prompt: ${requestData.prompt}`);

      const hfResponse = await fetch(
        `https://api-inference.huggingface.co/models/${requestData.model}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${hfApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: requestData.prompt,
            parameters: {
              width: requestData.width,
              height: requestData.height,
              num_inference_steps: requestData.steps,
              guidance_scale: requestData.cfgScale,
              negative_prompt: requestData.negativePrompt,
              seed: requestData.seed,
            },
          }),
        }
      );

      console.log(`HF API Response Status: ${hfResponse.status}`);

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        console.error("Hugging Face API Error:", errorText);

        // Handle specific error cases
        if (hfResponse.status === 503) {
          return res.status(503).json({ 
            message: "Model is currently loading. Please try again in a few seconds.",
            error: "Service temporarily unavailable"
          });
        } else if (hfResponse.status === 401) {
          return res.status(401).json({ 
            message: "Invalid API key. Please check your Hugging Face API key.",
            error: "Unauthorized"
          });
        } else {
          return res.status(500).json({ 
            message: "Image generation failed", 
            error: errorText 
          });
        }
      }

      // Check if response is an image
      const contentType = hfResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('image')) {
        const responseText = await hfResponse.text();
        console.error("Unexpected response format:", responseText);
        return res.status(500).json({ 
          message: "Unexpected response format from Hugging Face API",
          error: responseText
        });
      }

      // Get the image as blob and convert to base64
      const imageBlob = await hfResponse.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;

      // Save generated image to storage
      const generatedImage = await storage.createGeneratedImage({
        userId,
        prompt: requestData.prompt,
        negativePrompt: requestData.negativePrompt,
        model: requestData.model,
        stylePreset: requestData.stylePreset,
        imageUrl,
        width: requestData.width,
        height: requestData.height,
        steps: requestData.steps,
        cfgScale: requestData.cfgScale,
        seed: requestData.seed,
        settings: {
          width: requestData.width,
          height: requestData.height,
          steps: requestData.steps,
          cfgScale: requestData.cfgScale,
          negativePrompt: requestData.negativePrompt,
          seed: requestData.seed,
        },
      });

      // Deduct credits
      await storage.updateUserCredits(userId, user.credits - creditsNeeded);

      res.json(generatedImage);
    } catch (error) {
      console.error("Image generation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Download image
  app.get("/api/image/:id/download", async (req, res) => {
    try {
      const image = await storage.getGeneratedImage(req.params.id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Extract base64 data from data URL
      const base64Data = image.imageUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="mithix-ai-${image.id}.jpg"`);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
