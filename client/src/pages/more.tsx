import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Share2, UserX, FileText, ScrollText, CreditCard, LogOut } from "lucide-react";
import { useLocation } from "wouter"; 

export default function More() {
  const [, setLocation] = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    setLocation('/login'); 
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-4 border-b border-slate-700/50">
        <h1 className="text-xl font-semibold">More</h1>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <Button className="bg-slate-800/50 border-slate-700 space-x-3 flex items-center justify-between w-full">
              <div className="flex items-center">
                <Crown className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Manage Subscription</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">⚡</span>
                </div>
                <span className="text-purple-400 font-medium">150</span>
              </div>
            </Button>

            <Button className="bg-slate-800/50 border-slate-700 space-x-3 flex items-center">
              <Share2 className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Share Profile Link</span>
            </Button>

            <Button className="bg-slate-800/50 border-slate-700 space-x-3 flex items-center">
              <UserX className="w-5 h-5 text-red-400" />
              <span className="font-medium text-red-400">Delete Account</span>
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Help & Information</h2>
          <div className="space-y-3">
            <Button className="bg-slate-800/50 border-slate-700 space-x-3 flex items-center">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="font-medium">View Privacy Policy</span>
            </Button>

            <Button className="bg-slate-800/50 border-slate-700 space-x-3 flex items-center">
              <ScrollText className="w-5 h-5 text-slate-400" />
              <span className="font-medium">View Terms of Service</span>
            </Button>

            <Button className="bg-slate-800/50 border-slate-700 space-x-3 flex items-center">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <span className="font-medium">View Licensing Info</span>
            </Button>
          </div>
        </div>
        <div className="text-center text-slate-500 text-sm">
          <p>Version: 1.0.43 (64)</p>
        </div>
        <div className="text-center text-slate-400 text-sm">
          <p>user@mithix.ai</p>
        </div>
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-fit mx-auto bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white flex items-center space-x-2"
            data-testid="button-logout"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}