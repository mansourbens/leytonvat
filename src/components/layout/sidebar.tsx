import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  FileText,
  Home,
  Settings,
  Upload,
  Users,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Declarations", href: "/declarations", icon: FileText },
  { name: "VAT Obligations", href: "/obligations", icon: FileText },
  { name: "File Upload", href: "/upload", icon: Upload },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Clients", href: "/clients", icon: Users },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-primary text-primary-foreground z-30",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-primary-foreground/10">
        <div className="flex-shrink-0">
          <Building2 className="h-8 w-8" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold">Leyton VAT</h1>
            <p className="text-xs text-primary-foreground/70">
              Compliance Hub
            </p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Button
              key={item.name}
              onClick={() => navigate(item.href)}
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left",
                active
                  ? "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 py-4 border-t border-primary-foreground/10">
        {secondaryNavigation.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && <span>{item.name}</span>}
          </Button>
        ))}
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-primary-foreground/10">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-primary-foreground/70 truncate">
                VAT Specialist
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </div>
  );
}