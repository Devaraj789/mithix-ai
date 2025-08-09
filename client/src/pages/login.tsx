import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { Mail, Eye, EyeOff } from "lucide-react";
import MithixLogo from "@/components/mithix-logo";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleContinue = () => {
    // For demo, just redirect to home
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-20 animate-pulse"></div>
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
          </div>
          <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        </div>
      </div>

      <Card className="w-full max-w-md glass-card border-slate-700/50 relative z-10" data-testid="login-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-8">
            <MithixLogo className="w-10 h-10 mr-3" />
            <h1 className="text-2xl font-bold text-white">Mithix.AI</h1>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-white mb-2">
              {isSignUp ? "Create Account" : "Sign up or Login with"}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white">
              <FaApple className="w-5 h-5 mr-3" />
              Apple
            </Button>
            <Button variant="outline" className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white">
              <FaGoogle className="w-5 h-5 mr-3" />
              Google
            </Button>
            <Button variant="outline" className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white">
              <FaMicrosoft className="w-5 h-5 mr-3" />
              Microsoft
            </Button>
            <Button variant="outline" className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white">
              <Mail className="w-5 h-5 mr-3" />
              Continue with Email
            </Button>
          </div>

          <div className="text-center text-slate-400 mb-6">OR</div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <Input
                type="email"
                placeholder="name@host.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-primary"
                data-testid="input-email"
              />
            </div>
            {isSignUp && (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-primary pr-10"
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-8 h-8 w-8 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>

          <Button 
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            data-testid="button-continue"
          >
            Continue
          </Button>

          <div className="text-center mt-6">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:text-primary/80 text-sm">
              {isSignUp ? "Already have an account? Sign in" : "Need help?"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-center text-slate-400 text-sm mb-4">Available now on iOS and Android</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600 text-white">
                <FaApple className="w-4 h-4 mr-2" />
                App Store
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600 text-white">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center space-x-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}