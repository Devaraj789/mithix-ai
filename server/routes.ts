import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateImageRequestSchema } from "@shared/schema";
import { z } from "zod";
import sharp from "sharp";

// Function to add watermark to image
async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Create an enhanced styled watermark with gradient and effects
    const watermarkSvg = `
      <svg width="250" height="80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradient for "Mithix" -->
          <linearGradient id="mithixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#a855f7" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#c084fc" stop-opacity="0.9"/>
          </linearGradient>
          
          <!-- Gradient for "AI" -->
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#0891b2" stop-opacity="0.9"/>
          </linearGradient>
          
          <!-- Background gradient -->
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(0,0,0,0.6)" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.4)" stop-opacity="0.6"/>
          </linearGradient>
          
          <!-- Glow filter -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Drop shadow filter -->
          <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
          </filter>
        </defs>
        
        <!-- Background rounded rectangle -->
        <rect x="5" y="10" width="240" height="60" rx="15" ry="15" 
              fill="url(#bgGradient)" 
              stroke="rgba(255,255,255,0.2)" 
              stroke-width="1" 
              opacity="0.7"/>
        
        <!-- "Mithix" text with gradient and effects -->
        <text x="20" y="40" 
              font-family="Arial, sans-serif" 
              font-size="22" 
              font-weight="bold"
              fill="url(#mithixGradient)" 
              stroke="rgba(255,255,255,0.3)" 
              stroke-width="0.5"
              filter="url(#glow) url(#dropshadow)">Mithix</text>
        
        <!-- "AI" text with different gradient -->
        <text x="120" y="40" 
              font-family="Arial, sans-serif" 
              font-size="22" 
              font-weight="bold"
              fill="url(#aiGradient)" 
              stroke="rgba(255,255,255,0.3)" 
              stroke-width="0.5"
              filter="url(#glow) url(#dropshadow)">AI</text>
        
        <!-- Decorative elements -->
        <circle cx="160" cy="35" r="3" fill="url(#aiGradient)" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="170" cy="35" r="2" fill="url(#mithixGradient)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.4;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="180" cy="35" r="2.5" fill="url(#aiGradient)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Subtitle -->
        <text x="20" y="55" 
              font-family="Arial, sans-serif" 
              font-size="10" 
              fill="rgba(255,255,255,0.8)" 
              opacity="0.7">Image Generator</text>
      </svg>
    `;
    
    const watermarkBuffer = Buffer.from(watermarkSvg);
    
    // Get image metadata to position watermark
    const { width, height } = await sharp(imageBuffer).metadata();
    
    // Add watermark to bottom-right corner with better positioning
    const watermarkedImage = await sharp(imageBuffer)
      .composite([{
        input: watermarkBuffer,
        top: Math.max(0, (height || 1024) - 90),
        left: Math.max(0, (width || 1024) - 260),
        blend: 'over'
      }])
      .jpeg({ quality: 90 })
      .toBuffer();
    
    return watermarkedImage;
  } catch (error) {
    console.error("Watermark error:", error);
    // Return original image if watermarking fails
    return imageBuffer;
  }
}

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

      // Get the image as blob and convert to buffer
      const imageBlob = await hfResponse.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      
      // Add watermark to the image
      const watermarkedBuffer = await addWatermark(imageBuffer);
      const base64Image = watermarkedBuffer.toString('base64');
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
