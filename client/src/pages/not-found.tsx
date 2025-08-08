import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}