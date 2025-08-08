import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Generate from "@/pages/generate";
import Library from "@/pages/library";
import More from "@/pages/more";
import Login from "@/pages/login";
import Dimensions from "@/pages/dimensions";

function Router() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
        <Route path="/generate" component={Generate} />
        <Route path="/library" component={Library} />
        <Route path="/more" component={More} />
        <Route path="/dimensions" component={Dimensions} />
        <Route component={NotFound} />
      </Switch>

      {!isLoginPage && (
        <div className="pb-16">
          <Navigation />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-900">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
