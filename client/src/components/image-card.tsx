import { useState } from "react";
import { Download, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedImage } from "@shared/schema";

interface ImageCardProps {
  image: GeneratedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/image/${image.id}/download`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mithix-ai-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Downloaded!",
        description: "Image saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Generated Image",
          text: image.prompt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard.",
      });
    }
  };

  return (
    <Card
      className="group relative glass-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`image-card-${image.id}`}
    >
      <img
        src={image.imageUrl}
        alt={`AI generated: ${image.prompt}`}
        className="w-full h-64 object-cover"
        data-testid={`image-${image.id}`}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-sm text-slate-300 mb-2 line-clamp-2" title={image.prompt}>
            "{image.prompt}"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {image.model.split('/').pop()?.replace(/[-_]/g, ' ')}
            </span>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-slate-800/80 hover:bg-primary/20 rounded-lg transition-colors duration-200"
                onClick={handleDownload}
                data-testid={`button-download-${image.id}`}
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-slate-800/80 hover:bg-secondary/20 rounded-lg transition-colors duration-200"
                data-testid={`button-favorite-${image.id}`}
              >
                <Heart className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-slate-800/80 hover:bg-amber-500/20 rounded-lg transition-colors duration-200"
                onClick={handleShare}
                data-testid={`button-share-${image.id}`}
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
