import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Bot, Palette, Settings, Camera, Brush, Star, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GenerateImageRequest } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const modelOptions = [
  {
    value: "black-forest-labs/FLUX.1-schnell",
    label: "FLUX.1 Schnell",
    online: true,
    credits: 2,
    style: "Ultra-Fast",
    color: "from-blue-600/20 to-purple-600/20"
  },
  {
    value: "stabilityai/stable-diffusion-xl-base-1.0",
    label: "SDXL Base",
    online: true,
    credits: 5,
    style: "High Quality",
    color: "from-green-600/20 to-teal-600/20"
  },
  {
    value: "stabilityai/stable-diffusion-xl-refiner-1.0",
    label: "SDXL Refiner",
    online: true,
    credits: 5,
    style: "Detail Enhancement",
    color: "from-purple-600/20 to-pink-600/20"
  },
  {
    value: "ByteDance/SDXL-Lightning",
    label: "SDXL Lightning",
    online: true,
    credits: 3,
    style: "Fast Animation",
    color: "from-yellow-600/20 to-orange-600/20"
  },
  {
    value: "guoyww/animatediff-motion-adapter-sdxl-beta",
    label: "AnimateDiff SDXL",
    online: true,
    credits: 4,
    style: "Motion Graphics",
    color: "from-red-600/20 to-pink-600/20"
  },
  {
    value: "xinsir/controlnet-union-sdxl-1.0",
    label: "ControlNet Union",
    online: true,
    credits: 4,
    style: "Precise Control",
    color: "from-indigo-600/20 to-blue-600/20"
  },
  {
    value: "runwayml/stable-diffusion-v1-5",
    label: "Stable Diffusion v1.5",
    online: true,
    credits: 3,
    style: "Classic Quality",
    color: "from-cyan-600/20 to-blue-600/20"
  },
  {
    value: "CompVis/stable-diffusion-v1-4",
    label: "Stable Diffusion v1.4",
    online: true,
    credits: 3,
    style: "Reliable",
    color: "from-orange-600/20 to-red-600/20"
  },
  {
    value: "prompthero/openjourney-v4",
    label: "OpenJourney v4",
    online: true,
    credits: 4,
    style: "Artistic Style",
    color: "from-violet-600/20 to-purple-600/20"
  },
  {
    value: "diffusers/stable-diffusion-xl-1.0-inpainting-0.1",
    label: "SDXL Inpainting",
    online: true,
    credits: 5,
    style: "Image Editing",
    color: "from-emerald-600/20 to-green-600/20"
  }
];

const stylePresets = [
  { value: "auto", label: "Auto", icon: Camera },
  { value: "dynamic", label: "Dynamic", icon: Brush },
  { value: "photorealistic", label: "Photorealistic", icon: Camera },
  { value: "artistic", label: "Artistic", icon: Brush },
  { value: "anime", label: "Anime", icon: Star },
  { value: "scifi", label: "Sci-Fi", icon: Rocket },
];

const aspectRatios = [
  { value: "1:1-512", width: 512, height: 512, label: "1:1" },
  { value: "3:2", width: 768, height: 512, label: "3:2" },
  { value: "2:3", width: 512, height: 768, label: "2:3" },
  { value: "1:1-1024", width: 1024, height: 1024, label: "1:1" },
];

const promptTemplates = [
  "Fantasy Art",
  "Portrait",
  "Landscape",
  "Abstract",
];

export default function GenerationPanel() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("black-forest-labs/FLUX.1-schnell");
  const [selectedStyle, setSelectedStyle] = useState<string>("auto");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1-512");
  const [steps, setSteps] = useState([4]);
  const [cfgScale, setCfgScale] = useState([1]);
  const [numImages, setNumImages] = useState([1]);

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
      queryClient.invalidateQueries({ queryKey: ["/api/user/default-user/images"] });
      setPrompt("");
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    },
  });

  const selectedModelData = modelOptions.find(model => model.value === selectedModel);
  const selectedAspectData = aspectRatios.find(ratio => ratio.value === selectedAspectRatio);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedModelData?.online) {
      toast({
        title: "Model Offline",
        description: "Selected model is currently offline. Please choose another model.",
        variant: "destructive",
      });
      return;
    }

    const width = selectedAspectData?.width || 512;
    const height = selectedAspectData?.height || 512;

    generateImageMutation.mutate({
      prompt: prompt.trim(),
      model: selectedModel as any,
      stylePreset: selectedStyle as any,
      width,
      height,
      steps: steps[0],
      cfgScale: cfgScale[0],
      numImages: numImages[0],
    });
  };

  return (
    <div className="sticky top-24 space-y-6">
      {/* Hero Section */}
      <Card className="glass-card" data-testid="hero-section">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Create Amazing AI Art
            </h1>
            <p className="text-slate-400">Transform your ideas into stunning visuals with advanced AI models</p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Describe your image
              </label>
              <Textarea
                placeholder="A majestic dragon soaring through a mystical forest at sunset, cinematic lighting, highly detailed, 4K resolution..."
                className="min-h-32 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-primary focus:ring-primary/20 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                data-testid="input-prompt"
              />
            </div>

            {/* Quick Templates */}
            <div className="flex flex-wrap gap-2">
              {promptTemplates.map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  className="bg-slate-700/50 hover:bg-primary/20 border-slate-600 hover:border-primary/50 text-slate-300 hover:text-primary"
                  onClick={() => setPrompt(prev => prev ? `${prev}, ${template.toLowerCase()}` : template.toLowerCase())}
                  data-testid={`template-${template.toLowerCase().replace(' ', '-')}`}
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Selection */}
      <Card className="glass-card" data-testid="model-selection">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-primary" />
            AI Model
          </h3>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white focus:border-primary focus:ring-primary/20" data-testid="select-model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {modelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700 flex items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className={`w-2 h-2 rounded-full ${option.online ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-xs text-slate-400">{option.credits} credits</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedModelData && (
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${selectedModelData.online ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`${selectedModelData.online ? 'text-green-400' : 'text-red-400'}`}>
                {selectedModelData.online ? 'Online' : 'Offline'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{selectedModelData.credits} credits per image</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Style Presets */}
      <Card className="glass-card" data-testid="style-presets">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-secondary" />
            Style Presets
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {stylePresets.map((style) => {
              const IconComponent = style.icon;
              return (
                <Button
                  key={style.value}
                  variant="outline"
                  className={`p-3 bg-slate-700/30 hover:bg-primary/20 border-slate-600 hover:border-primary/50 text-sm transition-all duration-200 text-center h-auto flex flex-col items-center space-y-1 ${
                    selectedStyle === style.value ? 'border-primary/50 bg-primary/20' : ''
                  }`}
                  onClick={() => setSelectedStyle(selectedStyle === style.value ? "auto" : style.value)}
                  data-testid={`style-${style.value}`}
                >
                  <IconComponent className="w-4 h-4 text-primary" />
                  <span className="text-xs">{style.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="glass-card" data-testid="advanced-settings">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-amber-400" />
            Advanced Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio.value}
                    variant="outline"
                    size="sm"
                    className={`p-2 bg-slate-700/30 hover:bg-primary/20 border-slate-600 hover:border-primary/50 text-xs transition-all duration-200 ${
                      selectedAspectRatio === ratio.value ? 'border-primary/50 bg-primary/20' : ''
                    }`}
                    onClick={() => setSelectedAspectRatio(ratio.value)}
                    data-testid={`aspect-${ratio.value}`}
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Images</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="sm"
                    className={`p-2 bg-slate-700/30 hover:bg-primary/20 border-slate-600 hover:border-primary/50 text-xs transition-all duration-200 ${
                      numImages[0] === num ? 'border-primary/50 bg-primary/20' : ''
                    }`}
                    onClick={() => setNumImages([num])}
                    data-testid={`num-images-${num}`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Steps: <span className="text-primary">{steps[0]}</span>
              </label>
              <Slider
                value={steps}
                onValueChange={setSteps}
                min={10}
                max={50}
                step={1}
                className="slider"
                data-testid="slider-steps"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                CFG Scale: <span className="text-primary">{cfgScale[0]}</span>
              </label>
              <Slider
                value={cfgScale}
                onValueChange={setCfgScale}
                min={1}
                max={20}
                step={0.1}
                className="slider"
                data-testid="slider-cfg-scale"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generateImageMutation.isPending}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center space-x-2 h-auto"
        data-testid="button-generate"
      >
        <Sparkles className="w-4 h-4" />
        <span>{generateImageMutation.isPending ? "Generating..." : "Generate Image"}</span>
        <span className="bg-white/20 px-2 py-1 rounded-lg text-xs">
          {selectedModelData ? `${selectedModelData.credits * numImages[0]} credits` : '2 credits'}
        </span>
      </Button>
    </div>
  );
}