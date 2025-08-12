import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";

// Define a type for the presets to avoid implicit 'any'
interface Preset {
  value: string;
  label: string;
  width: number;
  height: number;
}

const socialPresets: Preset[] = [
  { value: "facebook", label: "Facebook (16:9)", width: 1200, height: 675 },
  { value: "instagram", label: "Instagram (4:5)", width: 1080, height: 1350 },
  { value: "twitter", label: "Twitter / X (4:3)", width: 1200, height: 900 },
  { value: "tiktok", label: "TikTok (9:16)", width: 1080, height: 1920 },
];

const devicePresets: Preset[] = [
  { value: "desktop", label: "Desktop (16:9)", width: 1920, height: 1080 },
  { value: "mobile", label: "Mobile (9:16)", width: 750, height: 1334 },
  { value: "tv", label: "TV (2:1)", width: 1920, height: 960 },
  { value: "square", label: "Square (1:1)", width: 1080, height: 1080 },
];

const filmPresets: Preset[] = [
  { value: "cinema", label: "Cinema (1.85:1)", width: 1920, height: 1038 },
  { value: "wide", label: "Wide (2.4:1)", width: 1920, height: 800 },
];

const standardPresets: Preset[] = [
  { value: "hd", label: "HD (16:9)", width: 1280, height: 720 },
  { value: "fullhd", label: "Full HD (16:9)", width: 1920, height: 1080 },
  { value: "4k", label: "4K (16:9)", width: 3840, height: 2160 },
];

export default function Dimensions() {
  const [, setLocation] = useLocation();
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [width, setWidth] = useState<number[]>([960]);
  const [height, setHeight] = useState<number[]>([960]);
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.value);
    setWidth([preset.width]);
    setHeight([preset.height]);
    setAspectRatio(preset.label.includes("(") ? preset.label.match(/\((.*?)\)/)?.[1] || "1:1" : "1:1");
  };

  const handleSliderChange = (newWidth: number[]) => {
    setWidth(newWidth);
    // You could also calculate and update height based on a locked aspect ratio here
    // Example: setHeight([Math.round(newWidth[0] / (16 / 9))]);
  };

  const handleOKClick = () => {
    // This is where you would handle the final selection.
    // For now, we'll just log the selected dimensions to the console.
    console.log(`Selected Dimensions: ${width[0]} x ${height[0]} with Aspect Ratio: ${aspectRatio}`);
    // You can add logic here to navigate to the next page or close the current view.
    // For example: setLocation("/generate");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/generate")}
          className="mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">More Image Dimensions</h1>
        {/* OK Button at the top right corner */}
        <div className="ml-auto">
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 text-md font-bold rounded-lg"
            onClick={handleOKClick}
          >
            OK
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Aspect Ratio Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-medium">Aspect Ratio</h2>
            <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-xs">?</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            {/* Aspect Ratio Preview */}
            <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-slate-500">
              <span className="text-sm text-slate-300">{aspectRatio}</span>
            </div>

            {/* Dimensions Display */}
            <div>
              <div className="text-sm text-slate-400">Image Dimensions:</div>
              <div className="text-purple-400 font-medium">{width[0]} × {height[0]} Pixels</div>
            </div>
          </div>

          {/* Width/Height Slider */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm text-slate-400 w-12">Wide</span>
            <div className="flex-1">
              <Slider
                value={width}
                onValueChange={handleSliderChange}
                min={512}
                max={2048}
                step={64}
                className="w-full"
              />
            </div>
            <span className="text-sm text-slate-400 w-12">Tall</span>
          </div>
        </div>

        {/* Social Media Presets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Socials</h3>
          <div className="grid grid-cols-2 gap-3">
            {socialPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                  selectedPreset === preset.value
                    ? "bg-purple-600/20 border-purple-600"
                    : "bg-slate-800/50 border-slate-600"
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <span className="text-sm font-medium">{preset.label.split('(')[0].trim()}</span>
                <span className="text-xs text-slate-400">
                  ({preset.label.match(/\((.*?)\)/)?.[1] || ''})
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Device Presets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Devices</h3>
          <div className="grid grid-cols-2 gap-3">
            {devicePresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                  selectedPreset === preset.value
                    ? "bg-purple-600/20 border-purple-600"
                    : "bg-slate-800/50 border-slate-600"
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <span className="text-sm font-medium">{preset.label.split('(')[0].trim()}</span>
                <span className="text-xs text-slate-400">
                  ({preset.label.match(/\((.*?)\)/)?.[1] || ''})
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Film Presets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Film</h3>
          <div className="grid grid-cols-2 gap-3">
            {filmPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                className={`h-16 flex flex-col items-center justify-center space-y-1 relative ${
                  selectedPreset === preset.value
                    ? "bg-purple-600/20 border-purple-600"
                    : "bg-slate-800/50 border-slate-600"
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <span className="text-sm font-medium">{preset.label.split('(')[0].trim()}</span>
                <span className="text-xs text-slate-400">
                  ({preset.label.match(/\((.*?)\)/)?.[1] || ''})
                </span>
                {/* Purple diamond icon for premium like in screenshot */}
                {preset.value === 'wide' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs">💎</span>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
