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
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
    <div className="flex-shrink-0">
      <svg className="w-8 h-8 text-zinc-900" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    {!collapsed && (
      <span className="font-semibold text-lg text-zinc-900">LegalDraw</span>
    )}
  </div>
);

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const NavigationContent = ({ isCollapsed }: { isCollapsed?: boolean }) => (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const NavLink = (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        );

        return isCollapsed ? (
          <Tooltip key={item.name}>
            <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
            <TooltipContent side="right" className="border shadow-sm">
              {item.name}
            </TooltipContent>
          </Tooltip>
        ) : (
          NavLink
        );
      })}
    </nav>
  );

  const ProfileSection = ({ isCollapsed }: { isCollapsed?: boolean }) => (
    <div className="border-t p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn(
            "w-full gap-3",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
              <User className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium text-zinc-900">John Doe</p>
                  <p className="text-xs text-zinc-500">john@example.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r transition-all duration-300",
        isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
      )}>
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Logo collapsed={isSidebarCollapsed} />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <NavigationContent isCollapsed={isSidebarCollapsed} />
          <ProfileSection isCollapsed={isSidebarCollapsed} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="h-16 border-b px-4">
            <SheetTitle asChild>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100vh-4rem)] flex-col">
            <NavigationContent />
            <ProfileSection />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden sm:flex flex-1 items-center gap-4">
            <div className="w-full max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9 border-zinc-200 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileSearchOpen(!isMobileSearchOpen)}>
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </header>

        {isMobileSearchOpen && (
          <div className="sm:hidden border-b bg-white px-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search documents..."
                className="pl-9 border-zinc-200"
                autoFocus
              />
            </div>
          </div>
        )}

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}