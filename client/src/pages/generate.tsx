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

// API-ஆல் ஆதரிக்கப்படும் மாடல்கள் மட்டும்
const modelOptions = [
  {
    value: "black-forest-labs/FLUX.1-schnell",
    label: "FLUX.1 Schnell",
    online: true,
    credits: 2,
    style: "ஃப்ளூயிட் & அப்ஸ்ட்ராக்ட்",
    color: "from-purple-600/20 to-indigo-600/20"
  },
  {
    value: "stabilityai/stable-diffusion-xl-base-1.0",
    label: "SDXL 1.0",
    online: true,
    credits: 5,
    style: "பிரமாண்டமான காட்சிகள்",
    color: "from-blue-600/20 to-teal-600/20"
  },
  {
    value: "ByteDance/SDXL-Lighting",
    label: "SDXL Lightning",
    online: true,
    credits: 3,
    style: "வேகமான அனிமேஷன்",
    color: "from-yellow-600/20 to-orange-600/20"
  },
  {
    value: "darkstorm2150/Protogen_x3.4_Official_Release",
    label: "Protogen x3.4",
    online: true,
    credits: 4,
    style: "சை-ஃபை & ரோபோட்கள்",
    color: "from-green-600/20 to-emerald-600/20"
  },
  {
    value: "xinsir/controller-union-sdxl-1.0",
    label: "Controller Union SDXL",
    online: true,
    credits: 3,
    style: "கேம் டிசைன் & கன்செப்ட்",
    color: "from-red-600/20 to-pink-600/20"
  },
];

// மாடல்-குறிப்பிட்ட டிரெண்டிங் ப்ராம்ப்ட்கள்
const modelTrendingPrompts: Record<string, string[]> = {
  "stabilityai/stable-diffusion-xl-base-1.0": [
    "பனிமலைகளுக்கு மேலே பறக்கும் பிரமாண்டமான டிராகன், அல்ட்ரா HD, விரிவான செதில்கள், எபிக் லைட்டிங்",
    "பறக்கும் கார்கள் மற்றும் நியான் விளக்குகளுடன் கூடிய பியூச்சரிஸ்டிக் நகரக் காட்சி, சைபர்பங்க் ஸ்டைல்",
    "ஒடிக்கும் ஆடைகளுடன் கூடிய பண்டைய கிரேக்க தேவதை, ஃபோட்டோரியலிஸ்டிக், சினிமாடிக் லைட்டிங்",
    "பவழப்பாறைகள் மற்றும் கடல் உயிரினங்களுடன் கூடிய நீருக்கடியில் அரண்மனை, ஃபேண்டசி ஆர்ட்",
    "விக்டோரியன் லண்டனுக்கு மேலே ஸ்டீம்பங்க் ஏர்க்கப்பல், சிக்கலான கியர்கள், தங்க நேரம்"
  ],
  "ByteDance/SDXL-Lighting": [
    "பளபளப்பான வாளுடன் கூடிய அனிமே வாரியர், டைனமிக் போஸ், ஸ்பீட் லைன்கள், தெளிவான நிறங்கள்",
    "இரவில் சைபர்பங்க் தெரு உணவு சந்தை, வேகமான மோஷன் பிளர், நியான் அடையாளங்கள்",
    "சூப்பர்ஹீரோ இறங்கும் தாக்கக் காட்சி, ஷாக்வேவ் விளைவு, காமிக் புத்தக ஸ்டைல்",
    "பியூச்சரிஸ்டிக் பாதையில் பந்தய கார், மோஷன் பிளர், அதிவேக நடவடிக்கை",
    "மந்திரப் பெண் மாற்றத் தொடர், பளபளப்பான துகள்கள், அனிமே ஸ்டைல்"
  ],
  "darkstorm2150/Protogen_x3.4_Official_Release": [
    "விரிவான கவசம், பளபளக்கும் கண்கள், பிந்தைய அபோகாலிப்டிக் பாழடைந்த பூமி ஆகியவற்றுடன் கூடிய சை-ஃபை ரோபோட்",
    "விசித்திரமான தாவரங்கள் மற்றும் விலங்குகளுடன் கூடிய அன்னிய கிரகம், ஹைப்பரியலிஸ்டிக், 8k ரெசல்யூஷன்",
    "நியான்-விளக்கும் மழையில் சைபோர்க் சாமுராய், சினிமாடிக், பிளேடு ரன்னர் ஸ்டைல்",
    "பாழடைந்த நகரத்தில் பியூச்சரிஸ்டிக் போர் மெக், வியத்தகு ஒளி, போர்",
    "நட்சத்திரக் கப்பல்கள் மற்றும் நெபுலாவுடன் கூடிய ஸ்பேஸ் ஓபரா காட்சி, எபிக் ஸ்கேல், டிஜிட்டல் ஆர்ட்"
  ],
  "black-forest-labs/FLUX.1-schnell": [
    "தெளிவான நிறங்களுடன் கூடிய அப்ஸ்ட்ராக்ட் ஃப்ளூயிட் ஆர்ட், மோஷன் பிளர், டைனமிக் காம்போசிஷன்",
    "மிதக்கும் தீவுகள் மற்றும் அருவிகளுடன் கூடிய சர்ரியல் இயற்கைக்காட்சி, கனவு போன்றது",
    "பளபளக்கும் விளிம்புகளுடன் கூடிய ஜியோமெட்ரிக் வடிவங்கள், ஆப்டிகல் இல்லூஷன், நவீன கலை",
    "பாலைவன இயற்கைக்காட்சியில் உருகும் கடிகாரம், சால்வடோர் டாலி ஸ்டைல், சர்ரியலிசம்",
    "பளபளக்கும் தாவரங்களுடன் கூடிய சைக்கடெலிக் காளான் காடு, ஃபேண்டசி விளக்கம்"
  ],
  "xinsir/controller-union-sdxl-1.0": [
    "கேம் கேரக்டர் கன்செப்ட் ஆர்ட், ஃபேண்டசி RPG, கவசம் மற்றும் ஆயுதங்களின் வடிவமைப்பு",
    "பொறிகளும் புதையலும் கொண்ட ஐசோமெட்ரிக் டஞ்சன் காட்சி, பிக்சல் ஆர்ட் ஸ்டைல்",
    "சைபர்நெட்டிகலி மேம்படுத்தப்பட்ட விலங்கு துணைகள், கேரக்டர் டிசைன் ஷீட்",
    "பியூச்சரிஸ்டிக் ஸ்பேஸ்கிராஃப்ட் கன்ட்ரோல்களுக்கான UI இன்டர்ஃபேஸ், HUD எலிமெண்ட்ஸ்",
    "பிளாட்ஃபார்மர் கேமிற்கான லெவல் டிசைன், வண்ணமயமான மேடைகள் மற்றும் தடைகள்"
  ]
};

// டிஃபால்ட் டிரெண்டிங் ப்ராம்ப்ட்கள்
const defaultTrendingPrompts = [
  "நியான் விளக்குகளுடன் இரவில் சைபர்பங்க் நகரக் காட்சி",
  "பனிமலைகளுக்கு மேலே பறக்கும் பிரமாண்டமான டிராகன்",
  "அன்னிய கிரகத்தை ஆராயும் விண்வெளி வீரர்",
  "கைவிடப்பட்ட நகரத்தில் விண்டேஜ் கார்",
  "பளபளக்கும் காளான்களுடன் மந்திர காடு"
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

  // டிஃபால்ட் மாடலை ஆதரிக்கப்படுவதாக மாற்றுதல்
  const [selectedModel, setSelectedModel] = useState(
    "stabilityai/stable-diffusion-xl-base-1.0"
  );

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

  // தற்போதைய மாடலுக்கான டிரெண்டிங் ப்ராம்ப்ட்கள்
  const selectedModelData = modelOptions.find(model => model.value === selectedModel);
  const currentTrendingPrompts = modelTrendingPrompts[selectedModel] || defaultTrendingPrompts;

  // ஜெனரேட் மியூடேஷன்
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
        title: "படம் உருவாக்கப்பட்டது!",
        description: "உங்கள் படம் வெற்றிகரமாக உருவாக்கப்பட்டது.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/user/default-user/images"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "உருவாக்கம் தோல்வியடைந்தது",
        description: error.message || "படத்தை உருவாக்க முடியவில்லை",
        variant: "destructive",
      });
    },
  });

  const selectedSizeData = imageSizes.find(size => size.value === selectedSize);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "ப்ராம்ப்ட் காணவில்லை",
        description: "உங்கள் படத்திற்கான விளக்கத்தை உள்ளிடவும்.",
        variant: "destructive",
      });
      return;
    }

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
      {/* ஹெடர் */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold mr-2">AI பட உருவாக்கி</h1>
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
        {/* ஸ்டைல் மற்றும் செட்டிங்ஸ் */}
        <div className="flex space-x-3 mb-4">
          {/* ஸ்டைல் தேர்வு */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-slate-800/50 border-slate-600 rounded-xl px-4 py-3"
                data-testid="button-styles"
              >
                <Sparkles className="w-4 h-4" />
                <span>ஸ்டைல்கள்</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-1000 border-slate-700 max-w-sm">
              <DialogHeader>
                <DialogTitle>ஸ்டைலைத் தேர்ந்தெடுக்கவும்</DialogTitle>
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

          {/* பிரீசெட் தேர்வு */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-slate-800/50 border-slate-600 rounded-xl px-4 py-3"
                data-testid="button-preset"
              >
                <Sparkles className="w-4 h-4" />
                <span>பிரீசெட்</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-1000 border-slate-600 max-w-sm">
              <DialogHeader>
                <DialogTitle>பிரீசெட்டைத் தேர்ந்தெடுக்கவும்</DialogTitle>
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

          {/* செட்டிங்ஸ் */}
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
                <DialogTitle>செட்டிங்ஸ்</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* மாடல் தேர்வு */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">மாடல்கள்</span>
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
                              {selectedModelData.credits} கிரெடிட்ஸ்
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
                                {model.online ? "ஆன்லைன்" : "ஆஃப்லைன்"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {model.credits} கிரெடிட்ஸ்
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* காண்ட்ராஸ்ட் */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">காண்ட்ராஸ்ட்</span>
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

                {/* அஸ்பெக்ட் ரேஷியோ */}
                <div>
                  <div className="flex space-x-2 mb-4">
                    {aspectRatios.map((ratio) => (
                      <Button
                        key={ratio.value}
                        variant="outline"
                        className={`flex-1 ${selectedAspectRatio === ratio.value ? "bg-orange-600/20 border-orange-600" : "bg-slate-800/50 border-slate-600"}`}
                        onClick={() => {
                          if (ratio.value === "more") {
                            window.location.href = "/dimensions";
                          } else {
                            setSelectedAspectRatio(ratio.value);
                          }
                        }}
                      >
                        {ratio.label}
                      </Button>
                    ))}
                  </div>

                  {/* பட அளவுகள் */}
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

                {/* படங்களின் எண்ணிக்கை */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-medium">படங்களின் எண்ணிக்கை</span>
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

                {/* பிரைவேட் மோட் */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">பிரைவேட் மோட்</span>
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
                  பணம் செலுத்தும் பயனர்களுக்கு மட்டுமே கிடைக்கும்
                </div>

                {/* மேம்பட்ட செட்டிங்ஸ் */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">மேம்பட்ட செட்டிங்ஸ்</span>
                  </div>

                  {/* டோகிள் ஆப்ஷன்ஸ் */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>ஃபோட்டோ ரியல்</span>
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
                        <span>நெகடிவ் ப்ராம்ப்ட்</span>
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

                {/* ஜெனரேட் பட்டன் */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify- space-x-2 text-sm text-slate-400 mb-4">
                    <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-brown-500 rounded flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <span>ஜெனரேட் செய்ய 15</span>
                  </div>
                  <Button className="w-full bg-slate-800/50 border border-slate-600 text-white hover:bg-slate-700/50">
                    டிஃபால்ட்களுக்கு மீட்டமைக்கவும்
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ப்ராம்ப்ட் இன்புட் */}
        <div className="space-y-3">
          <Textarea
            placeholder="உங்கள் படத்தை விவரிக்கவும்... அல்லது உங்கள் ப்ராம்ப்ட்களை உள்ளிடவும்..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-20 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-primary focus:ring-primary/20 resize-none rounded-xl"
            data-testid="input-prompt"
          />

          {/* கீழே உள்ள கன்ட்ரோல்ஸ் */}
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
                {generateImageMutation.isPending ? "..." : "▶ உருவாக்கு"}
              </Button>
            </div>
          </div>

          {/* டிரெண்டிங் ப்ராம்ப்ட்ஸ் */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {selectedModelData?.label} க்கான டிரெண்டிங் ப்ராம்ப்ட்ஸ்
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
                        #{index + 1} டிரெண்டிங்
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary hover:text-primary/80"
                        onClick={() => handleTryPrompt(prompt)}
                      >
                        முயற்சிக்கவும்
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