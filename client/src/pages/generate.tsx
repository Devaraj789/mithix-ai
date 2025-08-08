
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

const modelOptions = [
  {
    value: "black-forest-labs/FLUX.1-schnell",
    label: "FLUX.1 Schnell",
    online: true,
    credits: 2,
  },
  {
    value: "stabilityai/stable-diffusion-xl-base-1.0",
    label: "SDXL 1.0",
    online: true,
    credits: 5,
  },
  {
    value: "runwayml/stable-diffusion-v1-5",
    label: "Stable Diffusion 1.5",
    online: true,
    credits: 3,
  },
  { 
    value: "stabilityai/stable-diffusion-xl-refiner-1.0", 
    label: "SDXL Refiner 1.0", 
    online: true, 
    credits: 5 
  },
  {
    value: "CompVis/stable-diffusion-v1-4",
    label: "Stable Diffusion 1.4",
    online: true,
    credits: 3,
  },
  {
    value: "stabilityai/stable-diffusion-2-1",
    label: "Stable Diffusion 2.1",
    online: true,
    credits: 4,
  },
  {
    value: "stabilityai/sdxl-turbo",
    label: "SDXL Turbo",
    online: true,
    credits: 2,
  },
  {
    value: "ByteDance/SDXL-Lightning",
    label: "SDXL Lightning",
    online: true,
    credits: 3,
  },
  {
    value: "prompthero/openjourney-v4",
    label: "OpenJourney v4",
    online: true,
    credits: 3,
  },
  {
    value: "wavymulder/Analog-Diffusion",
    label: "Analog Diffusion",
    online: true,
    credits: 3,
  },
];

const trendingPrompts = [
  "Cyberpunk cityscape at night with neon lights",
  "Majestic dragon flying over mountains",
  "Astronaut exploring alien planet",
  "Vintage car in abandoned city",
  "Magic forest with glowing mushrooms",
  "Ancient castle floating in the clouds",
  "Phoenix rising from crystal flames",
  "Underwater city with bioluminescent creatures",
  "Time portal opening in a library",
  "Steampunk airship above Victorian London",
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
  { value: "minmalist", label: "Minimalist" },
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
  { value: "2:3", label: "2:3", width: 512, height: 768 },
  { value: "4:5", label: "4:5", width: 512, height: 640 },
  { value: "1:1", label: "1:1", width: 960, height: 960 },
  { value: "16:9", label: "16:9", width: 1024, height: 576 },
  { value: "9:16", label: "9:16", width: 576, height: 1024 },
];

const imageSizes = [
  { value: "small", label: "Small", width: 896, height: 896 },
  { value: "medium", label: "Medium", width: 960, height: 960 },
  { value: "large", label: "Large", width: 1024, height: 1024 },
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

  const [selectedModel, setSelectedModel] = useState("black-forest-labs/FLUX.1-schnell");
  const [selectedStyle, setSelectedStyle] = useState("auto");
  const [selectedPreset, setSelectedPreset] = useState("auto");
  const [selectedContrast, setSelectedContrast] = useState("Medium");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [numImages, setNumImages] = useState(1);
  const [privateMode, setPrivateMode] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);
  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showImageDimensions, setShowImageDimensions] = useState(false);
  const [showStyleReference, setShowStyleReference] = useState(false);
  const [showImageGuidance, setShowImageGuidance] = useState(false);
  const [hasStyleReference, setHasStyleReference] = useState(false);
  const [styleReferenceImages, setStyleReferenceImages] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const selectedModelData = modelOptions.find((model) => model.value === selectedModel);
  const selectedSizeData = imageSizes.find((size) => size.value === selectedSize);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating with size:", selectedSizeData);
    console.log("Generating with size:", selectedSizeData?.width, selectedSizeData?.height);
    
    const width = selectedSizeData?.width || 576;
    const height = selectedSizeData?.height || 1024;

    generateImageMutation.mutate({
      prompt: prompt.trim(),
      model: selectedModel as any,
      stylePreset: selectedStyle.toLowerCase() as any,
      width,
      height,
      steps: 4,
      cfgScale: 1,
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
          <h1 className="text-xl font-semibold mr-2">Image Gen</h1>
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
        {/* Style and Settings Selection */}
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
            <DialogContent className="bg-slate-1000 border-slate-700 max-w-sm">
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

          {/* Settings Icon */}
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
                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Contrast</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-400">{selectedContrast}</span>
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
                  <div className="flex space-x-2 mb-4">
                    {aspectRatios.map((ratio) => (
                      <Button
                        key={ratio.value}
                        variant="outline"
                        className={`flex-1 ${selectedAspectRatio === ratio.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => setSelectedAspectRatio(ratio.value)}
                      >
                        {ratio.label}
                      </Button>
                    ))}
                  </div>

                  {/* Image Sizes */}
                  <div className="flex space-x-2 mb-4">
                    {imageSizes.map((size) => (
                      <Button
                        key={size.value}
                        variant="outline"
                        className={`flex-1 flex flex-col ${selectedSize === size.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => setSelectedSize(size.value)}
                      >
                        <span className="font-medium">{size.label}</span>
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
                  Available for paid users only
                </div>

                {/* Advanced Settings */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Advanced Settings</span>
                  </div>

                  {/* Model Selection */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">Models</span>
                    </div>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
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

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>PhotoReal</span>
                        <Button variant="ghost" size="icon" className="w-4 h-4">
                          <span className="text-xs">?</span>
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
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
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-400 mb-4">
                    <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-brown-500 rounded flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <span>15 to Generate</span>
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
            placeholder="Describe your image... or Enter your prompts..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-20 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-primary focus:ring-primary/20 resize-none rounded-xl"
            data-testid="input-prompt"
          />

          {/* Below prompt controls */}
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
              <h2 className="text-lg font-semibold">Trending Prompts</h2>
            </div>
            <div className="space-y-2">
              {trendingPrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-red-600/20 to-black-600/20 border-black-500/30 hover:border-red-500/50 transition-colors"
                >
                  <CardContent className="p-3">
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
