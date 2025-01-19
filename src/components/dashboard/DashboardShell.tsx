'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  Users,
  Terminal,
  MessageSquare,
  Stethoscope,
  LifeBuoy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from '@/hooks/useUser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Main navigation items with descriptions for tooltips
const mainNavigation = [
  { 
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your workspace'
  },
  { 
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    description: 'Manage your legal documents'
  },
  { 
    name: 'Analytics',
    href: '/settings/downloads',
    icon: BarChart3,
    description: 'Document analytics and insights'
  },
  { 
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Manage your preferences'
  }
];

// Additional features (disabled/upcoming)
const additionalFeatures = [
  { 
    name: 'Teams',
    href: '/teams',
    icon: Users,
    description: 'Collaborate with team members',
    disabled: true
  },
  { 
    name: 'API',
    href: '/api',
    icon: Terminal,
    description: 'Access developer tools',
    disabled: true
  },
  { 
    name: 'AI Chat',
    href: '/chat',
    icon: MessageSquare,
    description: 'Chat with our AI assistant',
    disabled: true
  },
  { 
    name: 'Legal Doctor',
    href: '/doctor',
    icon: Stethoscope,
    description: 'AI-powered document review',
    disabled: true
  },
  { 
    name: 'Support',
    href: '/support',
    icon: LifeBuoy,
    description: '24/7 customer support',
    disabled: true
  }
];

const Logo = ({ collapsed = false }) => (
  <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
    <div className="flex-shrink-0">
      <svg className="w-8 h-8 text-zinc-900" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    {!collapsed && <span className="font-semibold text-lg text-zinc-900">LegalDraw</span>}
  </div>
);

const NavItem = ({ item, isCollapsed }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  const link = (
    <Link
      href={item.disabled ? '#' : item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out",
        isActive ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600",
        !item.disabled && "hover:bg-zinc-50 hover:text-zinc-900",
        isCollapsed && "justify-center w-10 px-0",
        item.disabled && "opacity-60 cursor-not-allowed"
      )}
      onClick={(e) => item.disabled && e.preventDefault()}
    >
      <item.icon className={cn(
        "w-[18px] h-[18px]",
        isActive ? "text-white" : "text-zinc-500",
        !item.disabled && "group-hover:text-zinc-900"
      )} />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  );

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {link}
      </TooltipTrigger>
      <TooltipContent 
        side={isCollapsed ? "right" : "right"} 
        className="bg-zinc-900 text-white border-0"
      >
        <div className="flex flex-col gap-1">
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-zinc-300">{item.description}</p>
          {item.disabled && (
            <p className="text-xs text-blue-300">Coming soon</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { getProfile, isLoading } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getProfile();
        setUserData(profile);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };
    loadUser();
  }, [getProfile]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const Sidebar = ({ isCollapsed }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Logo collapsed={isCollapsed} />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8"
          onClick={() => setSidebarCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-1">
          {mainNavigation.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
          
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
          
          {additionalFeatures.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>

      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn("w-full gap-3", isCollapsed && "justify-center px-0")}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                <User className="h-4 w-4 text-zinc-600" />
              </div>
              {!isCollapsed && userData && (
                <div className="flex flex-1 items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-zinc-900">{userData.name}</p>
                    <p className="text-xs text-zinc-500">{userData.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:bg-white",
          isSidebarCollapsed ? "lg:w-[68px]" : "lg:w-64"
        )}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col",
        isSidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-64"
      )}>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center gap-4">
            <div className="w-full max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search..."
                  className="pl-9 border-zinc-200 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}