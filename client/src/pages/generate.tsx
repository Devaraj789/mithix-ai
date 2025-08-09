import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  ChevronDown,
  Plus,
  Image,
  Video,
  Sparkles,
  Upload,
  X,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GenerateImageRequest } from "@shared/schema";

// API-supported models only
const modelOptions = [
  {
    value: "black-forest-labs/FLUX.1-schnell",
    label: "FLUX.1 Schnell",
    online: true,
    credits: 2,
    style: "Fluid & Abstract",
    color: "from-purple-600/20 to-indigo-600/20"
  },
  {
    value: "stabilityai/stable-diffusion-xl-base-1.0",
    label: "SDXL 1.0",
    online: true,
    credits: 5,
    style: "Grand Scenes",
    color: "from-blue-600/20 to-teal-600/20"
  },
  {
    value: "ByteDance/SDXL-Lighting",
    label: "SDXL Lightning",
    online: true,
    credits: 3,
    style: "Fast Animation",
    color: "from-yellow-600/20 to-orange-600/20"
  },
  {
    value: "darkstorm2150/Protogen_x3.4_Official_Release",
    label: "Protogen x3.4",
    online: true,
    credits: 4,
    style: "Sci-Fi & Robots",
    color: "from-green-600/20 to-emerald-600/20"
  },
  {
    value: "xinsir/controller-union-sdxl-1.0",
    label: "Controller Union SDXL",
    online: true,
    credits: 3,
    style: "Game Design & Concept",
    color: "from-red-600/20 to-pink-600/20"
  },
];

// Model-specific trending prompts
const modelTrendingPrompts: Record<string, string[]> = {
  "stabilityai/stable-diffusion-xl-base-1.0": [
    "Giant dragon flying over snow mountains, ultra HD, detailed scales, epic lighting",
    "Futuristic cityscape with flying cars and neon lights, cyberpunk style",
    "Ancient Greek goddess with flowing robes, photorealistic, cinematic lighting",
    "Underwater palace with coral reefs and sea creatures, fantasy art",
    "Steampunk airship above Victorian London, intricate gears, golden hour"
  ],
  "ByteDance/SDXL-Lighting": [
    "Anime warrior with glowing sword, dynamic pose, speed lines, vibrant colors",
    "Cyberpunk street food market at night, fast motion blur, neon signs",
    "Superhero landing impact scene, shockwave effect, comic book style",
    "Racing car on futuristic track, motion blur, high-speed action",
    "Magical girl transformation sequence, sparkling particles, anime style"
  ],
  "darkstorm2150/Protogen_x3.4_Official_Release": [
    "Sci-fi robot with detailed armor, glowing eyes, post-apocalyptic wasteland",
    "Alien planet with strange plants and animals, hyperrealistic, 8k resolution",
    "Cyborg samurai in neon-lit rain, cinematic, Blade Runner style",
    "Futuristic war mech in ruined city, dramatic lighting, battle scene",
    "Space opera scene with starships and nebula, epic scale, digital art"
  ],
  "black-forest-labs/FLUX.1-schnell": [
    "Abstract fluid art with vibrant colors, motion blur, dynamic composition",
    "Surreal landscape with floating islands and waterfalls, dreamlike",
    "Geometric shapes with glowing edges, optical illusion, modern art",
    "Melting clock in desert landscape, Salvador Dali style, surrealism",
    "Psychedelic mushroom forest with glowing plants, fantasy illustration"
  ],
  "xinsir/controller-union-sdxl-1.0": [
    "Game character concept art, fantasy RPG, armor and weapon design",
    "Isometric dungeon scene with traps and treasure, pixel art style",
    "Cybernetically enhanced animal companions, character design sheet",
    "UI interface for futuristic spacecraft controls, HUD elements",
    "Level design for platformer game, colorful platforms and obstacles"
  ]
};

// Default trending prompts
const defaultTrendingPrompts = [
  "Cyberpunk cityscape at night with neon lights",
  "Giant dragon flying over snow mountains",
  "Astronaut exploring alien planet",
  "Vintage car in abandoned city",
  "Magical forest with glowing mushrooms"
];

const styleOptions = [
  { value: "auto", label: "Auto" },
  { value: "dynamic", label: "Dynamic" },
  { value: "photorealistic", label: "Photorealistic" },
  { value: "artistic", label: "Artistic" },
  { value: "anime", label: "Anime" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "fantasy", label: "Fantasy" },
  { value: "horror", label: "Horror" },
  { value: "comic", label: "Comic" },
  { value: "retro", label: "Retro" },
  { value: "minimalist", label: "Minimalist" },
  { value: "modern", label: "Modern" },
  { value: "vintage", label: "Vintage" },
  { value: "futuristic", label: "Futuristic" },
];

const presetOptions = [
  { value: "auto", label: "Auto" },
  { value: "creative", label: "Creative" },
  { value: "balanced", label: "Balanced" },
  { value: "realistic", label: "Realistic" },
  { value: "dreamlike", label: "Dreamlike" },
  { value: "artistic", label: "Artistic" },
  { value: "cinematic", label: "Cinematic" },
  { value: "fast", label: "Fast" },
  { value: "quality", label: "Quality" },
  { value: "detailed", label: "Detailed" },
  { value: "abstract", label: "Abstract" },
  { value: "whimsical", label: "Whimsical" },
  { value: "mysterious", label: "Mysterious" },
  { value: "Playful", label: "Playful" },
  { value: "serene", label: "Serene" },
  { value: "bold", label: "Bold" },
  { value: "subtle", label: "Subtle" },
  { value: "surreal", label: "Surreal" },
  { value: "ethereal", label: "Ethereal" },
  { value: "elegant", label: "Elegant" },
  { value: "gritty", label: "Gritty" },
];

const aspectRatios = [
  { value: "1:1", label: "1:1", width: 1024, height: 1024 },
  { value: "4:3", label: "4:3", width: 1024, height: 768 },
  { value: "3:4", label: "3:4", width: 768, height: 1024 },
  { value: "16:9", label: "16:9", width: 1152, height: 648 },
  { value: "9:16", label: "9:16", width: 648, height: 1152 },
  { value: "3:2", label: "3:2", width: 1152, height: 768 },
  { value: "2:3", label: "2:3", width: 768, height: 1152 },
  { value: "custom", label: "Custom", width: 1024, height: 1024 },
];

const imageSizes = [
  { value: "small", label: "Small (512px)", width: 512, height: 512 },
  { value: "medium", label: "Medium (768px)", width: 768, height: 768 },
  { value: "large", label: "Large (1024px)", width: 1024, height: 1024 },
  { value: "xl", label: "XL (1536px)", width: 1536, height: 1536 },
];

const contrastLevels = ["Low", "Medium", "High"];

export default function Generate() {
  const [location] = useLocation();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPrompt = urlParams.get("prompt");
    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
  }, [location]);

  // Change default model to supported one
  const [selectedModel, setSelectedModel] = useState(
    "stabilityai/stable-diffusion-xl-base-1.0"
  );

  const [selectedStyle, setSelectedStyle] = useState("auto");
  const [selectedPreset, setSelectedPreset] = useState("auto");
  const [selectedContrast, setSelectedContrast] = useState("Medium");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [numImages, setNumImages] = useState(1);
  const [privateMode, setPrivateMode] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);
  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [negativePromptText, setNegativePromptText] = useState("");
  const [guidanceScale, setGuidanceScale] = useState(7);
  const [steps, setSteps] = useState(30);
  const [seed, setSeed] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showImageDimensions, setShowImageDimensions] = useState(false);
  const [showStyleReference, setShowStyleReference] = useState(false);
  const [showImageGuidance, setShowImageGuidance] = useState(false);
  const [hasStyleReference, setHasStyleReference] = useState(false);
  const [styleReferenceImages, setStyleReferenceImages] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Trending prompts for current model
  const selectedModelData = modelOptions.find(model => model.value === selectedModel);
  const currentTrendingPrompts = modelTrendingPrompts[selectedModel] || defaultTrendingPrompts;

  // Generate mutation
  const generateImageMutation = useMutation({
    mutationFn: async (data: GenerateImageRequest) => {
      const response = await apiRequest("POST", "/api/generate-image", {
        ...data,
        userId: "default-user",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Image Generated!",
        description: "Your image has been created successfully.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/user/default-user/images"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    },
  });

  const selectedSizeData = imageSizes.find(size => size.value === selectedSize);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return;
    }

    const aspectRatio = aspectRatios.find(r => r.value === selectedAspectRatio);

    let width, height;
    if (selectedAspectRatio === "custom") {
      width = customWidth;
      height = customHeight;
    } else if (aspectRatio) {
      // Use aspect ratio dimensions directly
      width = aspectRatio.width;
      height = aspectRatio.height;
    } else {
      // Fallback to 1:1 1024x1024
      width = 1024;
      height = 1024;
    }

    console.log(`Generating image with dimensions: ${width}x${height}`);

    generateImageMutation.mutate({
      prompt: prompt.trim(),
      negativePrompt: negativePrompt ? negativePromptText.trim() : undefined,
      model: selectedModel as any,
      stylePreset: selectedStyle.toLowerCase() as any,
      width,
      height,
      steps: steps,
      cfgScale: guidanceScale,
      seed: seed || undefined,
      numImages,
    });
  };

  function handleTryPrompt(_prompt: string): void {
    setPrompt(_prompt);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold mr-2">AI Image Generator</h1>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold">⚡</span>
            </div>
            <span className="text-white-400 font-medium">150</span>
          </div>
          <Button variant="ghost" size="icon" data-testid="button-menu">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Style and Settings */}
        <div className="flex space-x-3 mb-4">
          {/* Style Selection */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-slate-800/50 border-slate-600 rounded-xl px-4 py-3"
                data-testid="button-styles"
              >
                <Sparkles className="w-4 h-4" />
                <span>Styles</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-1000 border-slate-700 max-w-sm">
              <DialogHeader>
                <DialogTitle>Select Style</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((style) => (
                  <Button
                    key={style.value}
                    variant="outline"
                    className={`h-auto p-4 ${selectedStyle === style.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                    onClick={() => setSelectedStyle(style.value)}
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Preset Selection */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-slate-800/50 border-slate-600 rounded-xl px-4 py-3"
                data-testid="button-preset"
              >
                <Sparkles className="w-4 h-4" />
                <span>Preset</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-1000 border-slate-600 max-w-sm">
              <DialogHeader>
                <DialogTitle>Select Preset</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3">
                {presetOptions.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    className={`h-auto p-4 ${selectedPreset === preset.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                    onClick={() => setSelectedPreset(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Settings */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-600 rounded-xl p-4"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-1000 border-slate-700 max-w-sm max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Model Selection */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">Models</span>
                  </div>
                  <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <div className="flex items-center justify-between w-full">
                        <SelectValue />
                        {selectedModelData && (
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${selectedModelData.online ? "bg-green-400" : "bg-red-400"}`}
                            ></div>
                            <span className="text-xs text-slate-400">
                              {selectedModelData.credits} credits
                            </span>
                          </div>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {modelOptions.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.label}</span>
                            <div className="flex items-center space-x-2 ml-4">
                              <div
                                className={`w-2 h-2 rounded-full ${model.online ? "bg-green-400" : "bg-red-400"}`}
                              ></div>
                              <span
                                className={`text-xs ${model.online ? "text-green-400" : "text-red-400"}`}
                              >
                                {model.online ? "Online" : "Offline"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {model.credits} credits
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Contrast</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-400">
                      {selectedContrast}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {contrastLevels.map((level) => (
                      <Button
                        key={level}
                        variant="outline"
                        className={`w-full justify-start ${selectedContrast === level ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => setSelectedContrast(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {aspectRatios.map((ratio) => (
                      <Button
                        key={ratio.value}
                        variant="outline"
                        className={`flex flex-col p-2 h-auto text-xs ${selectedAspectRatio === ratio.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => {
                          setSelectedAspectRatio(ratio.value);
                        }}
                      >
                        <span className="font-medium">{ratio.label}</span>
                        {ratio.value !== "custom" && (
                          <span className="text-slate-400 text-xs mt-1">
                            {ratio.width}×{ratio.height}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Dimensions */}
                  {selectedAspectRatio === "custom" && (
                    <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                      <h3 className="text-sm font-medium mb-3 text-slate-300">Custom Dimensions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Width</label>
                          <input
                            type="number"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Math.max(256, Math.min(2048, parseInt(e.target.value) || 1024)))}
                            min="256"
                            max="2048"
                            step="64"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Height</label>
                          <input
                            type="number"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Math.max(256, Math.min(2048, parseInt(e.target.value) || 1024)))}
                            min="256"
                            max="2048"
                            step="64"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        Ratio: {(customWidth / customHeight).toFixed(2)}:1 | {customWidth} × {customHeight} pixels
                      </div>
                    </div>
                  )}

                  {/* Image Sizes */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {imageSizes.map((size) => (
                      <Button
                        key={size.value}
                        variant="outline"
                        className={`flex flex-col p-3 h-auto ${selectedSize === size.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => setSelectedSize(size.value)}
                      >
                        <span className="font-medium text-sm">{size.label}</span>
                        <span className="text-xs text-slate-400">
                          {size.width} × {size.height}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Number of Images */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-medium">Number of Images</span>
                    <Button variant="ghost" size="icon" className="w-4 h-4">
                      <span className="text-xs">?</span>
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant="outline"
                        className={`flex-1 ${numImages === num ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => setNumImages(num)}
                      >
                        {num}
                        <div className="w-4 h-4 ml-1 bg-gradient-to-r from-orange-500 to-brown-500 rounded flex items-center justify-center">
                          <span className="text-xs">⚡</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Private Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Private Mode</span>
                    <Button variant="ghost" size="icon" className="w-4 h-4">
                      <span className="text-xs">?</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 rounded flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <Switch
                      checked={privateMode}
                      onCheckedChange={setPrivateMode}
                      disabled={true}
                      className="opacity-50"
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-400 -mt-2">
                  Available only for paid users
                </div>

                {/* Advanced Settings */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Advanced Settings</span>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Photo Real</span>
                        <Button variant="ghost" size="icon" className="w-4 h-4">
                          <span className="text-xs">?</span>
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="">
                          <span className="text-xs"></span>
                        </div>
                        <Switch
                          checked={photoReal}
                          onCheckedChange={setPhotoReal}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>Negative Prompt</span>
                        <Button variant="ghost" size="icon" className="w-4 h-4">
                          <span className="text-xs">?</span>
                        </Button>
                      </div>
                      <Switch
                        checked={negativePrompt}
                        onCheckedChange={setNegativePrompt}
                      />
                    </div>

                    {/* Negative Prompt Textbox */}
                    {negativePrompt && (
                      <div className="mt-3">
                        <Textarea
                          placeholder="Describe what you don't want in your image..."
                          value={negativePromptText}
                          onChange={(e) => setNegativePromptText(e.target.value)}
                          className="min-h-16 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 resize-none rounded-lg"
                        />
                      </div>
                    )}

                    {/* Guidance Scale */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Guidance Scale</span>
                          <Button variant="ghost" size="icon" className="w-4 h-4">
                            <span className="text-xs">?</span>
                          </Button>
                        </div>
                        <span className="text-sm text-slate-400">{guidanceScale}</span>
                      </div>
                      <Slider
                        value={[guidanceScale]}
                        onValueChange={(value) => setGuidanceScale(value[0])}
                        min={1}
                        max={20}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Steps */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Steps</span>
                          <Button variant="ghost" size="icon" className="w-4 h-4">
                            <span className="text-xs">?</span>
                          </Button>
                        </div>
                        <span className="text-sm text-slate-400">{steps}</span>
                      </div>
                      <Slider
                        value={[steps]}
                        onValueChange={(value) => setSteps(value[0])}
                        min={1}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Seed */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Seed</span>
                          <Button variant="ghost" size="icon" className="w-4 h-4">
                            <span className="text-xs">?</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
                          className="text-xs text-orange-400 hover:text-orange-300"
                        >
                          Random
                        </Button>
                      </div>
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                        placeholder="Enter seed (0 for random)"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:border-orange-500 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify- space-x-2 text-sm text-slate-400 mb-4">
                    <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-brown-500 rounded flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <span>15 to generate</span>
                  </div>
                  <Button className="w-full bg-slate-800/50 border border-slate-600 text-white hover:bg-slate-700/50">
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <Textarea
            placeholder="Describe your image... or enter your prompts..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-20 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-primary focus:ring-primary/20 resize-none rounded-xl"
            data-testid="input-prompt"
          />

          {/* Bottom Controls */}
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-brown-500 rounded flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
              <span>15</span>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-brown-500 hover:from-purple-600 hover:to-pink-600 rounded-lg px-6"
                onClick={handleGenerate}
                disabled={generateImageMutation.isPending}
                data-testid="button-generate"
              >
                {generateImageMutation.isPending ? "..." : "▶ Generate"}
              </Button>
            </div>
          </div>

          {/* Trending Prompts */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Trending Prompts for {selectedModelData?.label}
              </h2>
              <span className="text-xs text-slate-400 px-2 py-1 rounded bg-slate-800">
                {selectedModelData?.style}
              </span>
            </div>
            <div className="space-y-2">
              {currentTrendingPrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className={`bg-gradient-to-br ${selectedModelData?.color} border-slate-600/30 hover:border-slate-500/50 transition-colors`}
                >
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-300">{prompt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        #{index + 1} trending
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary hover:text-primary/80"
                        onClick={() => handleTryPrompt(prompt)}
                      >
                        Try it
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}