import { useQuery } from "@tanstack/react-query";
import { Grid, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageCard from "./image-card";
import LoadingState from "./loading-state";
import type { GeneratedImage } from "@shared/schema";



export default function ImageGallery() {
  const { data: images, isLoading, error } = useQuery<GeneratedImage[]>({
    queryKey: ["/api/user/default-user/images"],
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load images</p>
      </div>
    );
  }

  return (
    <div data-testid="image-gallery">
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Creations</h2>
          <p className="text-slate-400">Generated images and your creative history</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon" className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-600" data-testid="button-grid-view">
            <Grid className="w-4 h-4 text-slate-400" />
          </Button>
          <Button variant="outline" size="icon" className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-600" data-testid="button-list-view">
            <List className="w-4 h-4 text-slate-400" />
          </Button>
          <Button variant="outline" size="icon" className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-600" data-testid="button-filter">
            <Filter className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      {!images || images.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <div className="text-slate-400 mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
              <Grid className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p>Start creating amazing AI art by entering a prompt and clicking Generate!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="images-grid">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {images && images.length > 0 && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-600 hover:border-primary/50 text-slate-300 hover:text-white font-semibold py-3 px-8"
            data-testid="button-load-more"
          >
            Load More Images
          </Button>
        </div>
      )}
    </div>
  );
}