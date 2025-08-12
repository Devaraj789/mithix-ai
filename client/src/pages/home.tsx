import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import MithixLogo from "@/components/mithix-logo";

const trendingPrompts = [
  "Ancient castle floating in the clouds",
  "Phoenix rising from crystal flames",
  "Underwater city with bioluminescent creatures",
  "Time portal opening in a library",
  "Steampunk airship above Victorian London",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleTryPrompt = (prompt: string) => {
    setLocation(`/generate?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <MithixLogo size="md" showText={true} />
          <div className="flex items-center space-x-3">
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold">⚡</span>
              </div>
              <span className="text-white-400 font-medium">150</span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-purple-600 hover:to-pink-600 rounded-lg px-6"
            >
              Upgrade
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Start</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/generate">
              <Card className="bg-gradient-to-br from-pink-600/20 to--600/20 border-black-500/30 hover:border-pink-500/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium">Create Image</h3>
                  <p className="text-sm text-slate-400 mt-1">Generate AI artwork</p>
                </CardContent>
              </Card>
            </Link>
            <Card className="bg-gradient-to-br from-blue-600/20 to-black-600/20 border-blue-500/30 hover:border-blue-500/50 transition-colors">
              <CardContent className="p-4 text-center">
                <h3 className="font-medium">Explore</h3>
                <p className="text-sm text-slate-400 mt-1">Browse community art</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started Tips */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tips for Better Results</h2>
          <div className="space-y-3">
            <Card className="bg-gradient-to-br from-green-600/20 to-black-600/20 border-black-500/30 hover:border-green-500/50 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2">💡 Be Descriptive</h3>
                <p className="text-xs text-slate-400">Include details like lighting, mood, style, and composition for better results.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600/20 to-black-600/20 border-black-500/30 hover:border-green-500/50 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2">🎨 Try Different Styles</h3>
                <p className="text-xs text-slate-400">Experiment with various style presets to find your perfect aesthetic.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600/20 to-black-600/20 border-black-500/30 hover:border-green-500/50 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2">⚡ Save Credits</h3>
                <p className="text-xs text-slate-400">Use FLUX.1 Schnell for fast, low-cost generations (only 2 credits).</p>
              </CardContent>
            </Card>
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
            className="bg-gradient-to-br from-red-600/20 to-black-600/20 border-black-500/30 hover:border-red-500/50 transition-colors">
            <CardContent className="p-0.25">
              <p className="text-sm text-slate-300">{prompt}</p>
              <div className="flex items-center justify-between mt-0.25">
                <span className="text-xs text-slate-500">#{index + 1} trending</span>
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
  );
}