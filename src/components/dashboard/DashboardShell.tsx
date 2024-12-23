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
  FileText,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
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

export default function DashboardShell({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const NavigationContent = ({ isCollapsed }: { isCollapsed?: boolean }) => (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const NavLink = (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        );

        return isCollapsed ? (
          <Tooltip key={item.name} delayDuration={0}>
            <TooltipTrigger asChild>
              {NavLink}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white border shadow-sm">
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
            "w-full gap-2",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300",
          isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="flex flex-1 flex-col bg-white shadow-sm">
          {/* Logo and Toggle */}
          <div className="flex h-16 items-center gap-2 border-b px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && <span className="font-semibold">LegalDraw AI</span>}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "ml-auto h-8 w-8",
                isSidebarCollapsed && "ml-0"
              )}
              onClick={handleSidebarToggle}
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
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-semibold">LegalDraw AI</span>
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

          {/* Desktop Search */}
          <div className="hidden sm:flex flex-1 items-center gap-4">
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="sm:hidden border-b bg-white px-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}