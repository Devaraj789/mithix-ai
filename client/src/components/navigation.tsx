import { Link, useLocation } from "wouter";
import { Home, Image, Folder, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import MithixLogo from "@/components/mithix-logo";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/generate", icon: Image, label: "Generate" },
  { href: "/library", icon: Folder, label: "Library" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 z-50">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const isActive = location === item.href || 
            (item.href !== "/" && location.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-slate-400 hover:text-slate-300"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}