import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <Card className="glass-card" data-testid="loading-state">
      <CardContent className="p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Creating your masterpiece...</h3>
        <p className="text-slate-400 mb-4">This usually takes 15-30 seconds</p>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-1/3 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
