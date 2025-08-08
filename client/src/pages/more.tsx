import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Crown, 
  Share2, 
  UserX, 
  FileText, 
  ScrollText, 
  CreditCard, 
  LogOut,
  User
} from "lucide-react";
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { useRouter } from 'next/router'; // Import useRouter for navigation


export default function More() {
  const router = useRouter(); // Initialize router

  // Function to handle logout
  const handleLogout = () => {
    // Clear authentication state here (e.g., remove token from local storage or context)
    // For demonstration, we'll just redirect. In a real app, you'd also clear auth tokens.
    localStorage.removeItem('authToken'); // Example: Remove token from local storage
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <h1 className="text-xl font-semibold">More</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Manage Subscription</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">⚡</span>
                    </div>
                    <span className="text-purple-400 font-medium">150</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Share2 className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Share Profile Link</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <UserX className="w-5 h-5 text-red-400" />
                  <span className="font-medium text-red-400">Delete Account</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help & Information Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Help & Information</h2>
          <div className="space-y-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">View Privacy Policy</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <ScrollText className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">View Terms of Service</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">View Licensing Info</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>Version: 1.0.43 (64)</p>
        </div>

        {/* User Email */}
        <div className="text-center text-slate-400 text-sm">
          <p>user@mithix.ai</p>
        </div>

        {/* Logout Button */}
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