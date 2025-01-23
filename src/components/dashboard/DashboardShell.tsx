'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDocument } from '@/hooks/useDocument';
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
  LifeBuoy,
  X,
  Sparkles,
  Command,
  Play
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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Main navigation with metadata
const mainNavigation = [
  { 
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and insights',
    color: 'text-blue-500'
  },
  { 
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    description: 'Manage legal documents',
    color: 'text-purple-500'
  },
  { 
    name: 'Analytics',
    href: '/settings/downloads',
    icon: BarChart3,
    description: 'Document insights',
    color: 'text-emerald-500'
  },
  { 
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account settings',
    color: 'text-gray-500'
  },
  { 
    name: 'Support',
    href: '/support',
    icon: LifeBuoy,
    description: 'Get help',
    color: 'text-amber-500'
  }
];

// Premium features (some disabled)
const premiumFeatures = [
  { 
    name: 'Teams',
    href: '/teams',
    icon: Users,
    description: 'Collaborate with others',
    badge: 'Soon',
    disabled: true,
    color: 'text-indigo-500'
  },
  { 
    name: 'API Access',
    href: '/api',
    icon: Terminal,
    description: 'Developer tools',
    badge: 'Soon',
    disabled: true,
    color: 'text-cyan-500'
  },
  { 
    name: 'AI Chat',
    href: '/chat',
    icon: MessageSquare,
    description: 'AI assistance',
    badge: 'Soon',
    disabled: true,
    color: 'text-pink-500'
  },
  { 
    name: 'Doc Review',
    href: '/review',
    icon: Stethoscope,
    description: 'AI document review',
    badge: 'Soon',
    disabled: true,
    color: 'text-rose-500'
  }
];

function Logo({ collapsed = false }) {
  return (
    <div className={cn(
      "flex items-center gap-3",
      collapsed ? "justify-center" : "px-4"
    )}>
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
        <div className="absolute inset-0.5 rounded-[6px] bg-white dark:bg-gray-950" />
        <Sparkles className="absolute inset-1 h-6 w-6 text-blue-500" />
      </div>
      {!collapsed && (
        <span className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LegalDraw
        </span>
      )}
    </div>
  );
}

function NavItem({ 
  item, 
  isCollapsed, 
  isChild = false 
}: { 
  item: any; 
  isCollapsed: boolean;
  isChild?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  const link = (
    <Link
      href={item.disabled ? '#' : item.href}
      className={cn(
        "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out",
        isActive 
          ? "bg-gray-900 text-white" 
          : "text-gray-600 dark:text-gray-400",
        !item.disabled && "hover:bg-gray-50 dark:hover:bg-gray-900/50",
        isCollapsed && "justify-center w-10 px-0",
        item.disabled && "opacity-50 cursor-not-allowed",
        isChild && "ml-4 py-2"
      )}
      onClick={(e) => item.disabled && e.preventDefault()}
    >
      <item.icon className={cn(
        "flex-shrink-0 w-5 h-5",
        item.color,
        isActive && "text-white"
      )} />
      
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <Badge variant={isActive ? "outline" : "secondary"} className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <div className="relative group">
        {link}
        <div className="absolute left-full pl-2 ml-1 hidden group-hover:block">
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
            {item.badge && <Badge variant="secondary" className="mt-1">{item.badge}</Badge>}
          </div>
        </div>
      </div>
    );
  }

  return link;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { getProfile, isLoading } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const { documents = [], fetchDocuments } = useDocument();
const hasFetched = useRef(false);

useEffect(() => {
  if (!hasFetched.current) {
    fetchDocuments(0, 3);
    hasFetched.current = true;
  }
}, [fetchDocuments]);

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex h-full flex-col gap-y-5">
      <div className="flex h-16 items-center justify-between border-b">
        <Logo collapsed={isCollapsed} />
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-8 w-8"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-y-7 px-2">
        {/* Search Trigger */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-500 rounded-lg border shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900/50"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Quick search...</span>
            <kbd className="ml-auto text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        )}

        {/* Main Navigation */}
        <nav className="flex flex-col gap-y-7">
          <div className="space-y-1">
            {mainNavigation.map((item) => (
              <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>

          <div>
            <div className={cn(
              "flex items-center gap-2 px-3 mb-2",
              isCollapsed && "justify-center"
            )}>
              {!isCollapsed && (
                <span className="text-xs font-semibold text-gray-500">FEATURES</span>
              )}
              <Badge variant="secondary" className="ml-auto">Pro</Badge>
            </div>
            <div className="space-y-1">
              {premiumFeatures.map((item) => (
                <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* User Menu */}
      <div className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full gap-2 px-2", 
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.avatar} />
                <AvatarFallback>
                  {userData?.name?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-medium">{userData?.name}</span>
                    <span className="text-xs text-gray-500">{userData?.email}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/billing">Billing & Plans</Link>
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:bg-white dark:lg:bg-gray-900",
          isSidebarCollapsed ? "lg:w-[68px]" : "lg:w-64"
        )}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <Sidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Command Menu */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search across LegalDraw..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {mainNavigation.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => {
                  setIsCommandOpen(false);
                  window.location.href = item.href;
                }}
              >
                <item.icon className={cn("mr-2 h-4 w-4", item.color)} />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Features">
            {premiumFeatures
              .filter(item => !item.disabled)
              .map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => {
                    setIsCommandOpen(false);
                    window.location.href = item.href;
                  }}
                >
                  <item.icon className={cn("mr-2 h-4 w-4", item.color)} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
          </CommandList>
      </CommandDialog>

      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col",
        isSidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-64"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Desktop Search Bar */}
              <div className="hidden md:block w-96">
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-500"
                  onClick={() => setIsCommandOpen(true)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search...</span>
                  <kbd className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    ⌘K
                  </kbd>
                </Button>
              </div>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsCommandOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Conditional rendering for collapsed sidebar button */}
              {isSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => setSidebarCollapsed(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {/* Notifications */}
              <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {documents?.length > 0 && (
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500" />
      )}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-96">
    <DropdownMenuLabel className="flex items-center justify-between">
      Recent Documents
      {documents?.length > 0 && (
        <Badge variant="secondary">{documents.length} Recent</Badge>
      )}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    
    {documents?.slice(0, 3).map((doc, i) => (
      <DropdownMenuItem 
        key={doc.document_id} 
        className="flex flex-col items-start gap-1 p-4 cursor-pointer"
        onClick={() => window.location.href = `/documents/${doc.document_id}`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-blue-500" />
          {doc.title || doc.document_type?.replace('_', ' ') || 'Untitled Document'}
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              doc.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            )}
          >
            {doc.status}
          </Badge>
          <span className="text-xs text-gray-500">
            {new Date(doc.generated_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          {doc.description || 'No description provided'}
        </p>
      </DropdownMenuItem>
    ))}
    
    {documents?.length === 0 && (
      <div className="p-4 text-center">
        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No recent documents</p>
      </div>
    )}
    
    <DropdownMenuSeparator />
    <DropdownMenuItem 
      className="w-full text-center text-sm text-blue-500"
      onClick={() => window.location.href = '/documents'}
    >
      View All Documents
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

              {/* Help Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LifeBuoy className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => window.location.href = '/support'}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/documentation'}>
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/tutorials'}>
                    <Play className="mr-2 h-4 w-4" />
                    Video Tutorials
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem>
                    <Terminal className="mr-2 h-4 w-4" />
                    API Reference
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.avatar} />
                      <AvatarFallback>
                        {userData?.name?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData?.name}</p>
                      <p className="text-xs text-gray-500">{userData?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/billing">Billing & Plans</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Search (Expandable) */}
          <div className="border-t py-2 px-4 md:hidden">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-500"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}