import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Heart, Share2, MoreHorizontal, Eye, User, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GeneratedImage } from "@shared/schema";

export default function Library() {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showImageActions, setShowImageActions] = useState(false);
  const { toast } = useToast();

  const { data: images, isLoading } = useQuery<GeneratedImage[]>({
    queryKey: ["/api/user/default-user/images"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/default-user/images");
      return response.json();
    },
  });

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.imageUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${image.id}.png`;
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

  const handleImageAction = (action: string, image: GeneratedImage) => {
    switch (action) {
      case "info":
        setSelectedImage(image);
        break;
      case "private":
        toast({
          title: "Visibility Updated",
          description: "Image visibility has been changed",
        });
        break;
      case "reuse":
        // Copy prompt to clipboard
        navigator.clipboard.writeText(image.prompt);
        toast({
          title: "Prompt Copied",
          description: "Prompt has been copied to clipboard",
        });
        break;
      case "delete":
        toast({
          title: "Delete All",
          description: "All images will be deleted",
          variant: "destructive",
        });
        break;
      case "favorite":
        toast({
          title: "Favorited",
          description: "Image has been favorited",
        });
        break;
      case "share":
        toast({
          title: "Shared",
          description: "Image has been shared",
        });
        break;
    }
    setShowImageActions(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your creations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="font-medium">MithixUser</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold">⚡</span>
            </div>
            <span className="text-purple-400 font-medium">150</span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg px-4"
          >
            Upgrade
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="p-4">
        {!images || images.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p>Start creating amazing AI art to see them here!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.imageUrl}
                  alt={`Generated: ${image.prompt}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-slate-800/80 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-slate-800/80 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageAction("favorite", image);
                      }}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-slate-800/80 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageAction("share", image);
                      }}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-slate-800/80 hover:bg-slate-600/80 rounded-lg transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowImageActions(true);
                        setSelectedImage(image);
                      }}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Actions Dialog */}
      <Dialog open={showImageActions} onOpenChange={setShowImageActions}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-sm">
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => selectedImage && handleImageAction("info", selectedImage)}
            >
              <Eye className="w-4 h-4 mr-3" />
              View Generation Info
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => selectedImage && handleImageAction("private", selectedImage)}
            >
              <User className="w-4 h-4 mr-3" />
              Make Private
              <span className="ml-auto text-xs text-slate-400">Visibility is currently public</span>
              <div className="w-4 h-4 ml-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => selectedImage && handleImageAction("reuse", selectedImage)}
            >
              <Copy className="w-4 h-4 mr-3" />
              Reuse prompt
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-400 hover:text-red-300"
              onClick={() => selectedImage && handleImageAction("delete", selectedImage)}
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete All
              <div className="w-4 h-4 ml-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage && !showImageActions} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-slate-00 border-slate-700 max-w-md">
          {selectedImage && (
            <div className="space-y-">
              <img
                src={selectedImage.imageUrl}
                alt={`Generated: ${selectedImage.prompt}`}
                className="w-full rounded-lg"
              />
              <div className="space-y-2">
                <h3 className="font-semibold">Prompt</h3>
                <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                  {selectedImage.prompt}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Model:</span>
                  <p className="font-medium">{selectedImage.model.split('/').pop()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Style:</span>
                  <p className="font-medium">{selectedImage.stylePreset || 'Auto'}</p>
                    </div>
                      {selectedImage.width && selectedImage.height && selectedImage.steps ? (
                        <>
                          <div>
                            <span className="text-slate-400">Size:</span>
                            <p className="font-medium">
                              {selectedImage.width} × {selectedImage.height}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400">Steps:</span>
                            <p className="font-medium">{selectedImage.steps}</p>
                          </div>
                        </>
                      ) : null}
                  </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage.prompt);
                    toast({
                      title: "Prompt Copied",
                      description: "Prompt has been copied to clipboard",
                    });
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600"
                  onClick={() => selectedImage && handleDownload(selectedImage)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}