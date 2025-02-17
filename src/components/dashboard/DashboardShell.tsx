'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDocument } from '@/hooks/useDocument';
import { useUser } from '@/hooks/useUser';
import { authApi } from '@/lib/api/auth';
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

// Icons
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
  Sparkles,
  Play
} from "lucide-react";

// Types
interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  color: string;
  badge?: string;
  disabled?: boolean;
}

interface UserData {
  name?: string;
  email?: string;
  avatar?: string;
}

interface Document {
  document_id: string;
  title?: string;
  document_type?: string;
  status: string;
  generated_at: string;
  description?: string;
}

// Navigation Configuration
const mainNavigation: NavigationItem[] = [
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

const premiumFeatures: NavigationItem[] = [
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

// Components
const Logo = ({ collapsed = false }) => (
  <div className={cn(
    "flex items-center gap-3",
    collapsed ? "justify-center" : "px-4"
  )}>
    <div className="relative h-8 w-8">
      <img src="/logos/sonetz-logo.svg" alt="" />
    </div>
    {!collapsed && (
      <span className="font-semibold text-xl text-gray-900">
        Docwelo
      </span>
    )}
  </div>
);

const NavItem = ({ item, isCollapsed }: { item: NavigationItem; isCollapsed: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  const LinkContent = (
    <Link
      href={item.disabled ? '#' : item.href}
      className={cn(
        "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out",
        isActive 
          ? "bg-gray-900 text-white" 
          : "text-gray-600 dark:text-gray-400",
        !item.disabled && "hover:bg-gray-50 dark:hover:bg-gray-900/50",
        isCollapsed && "justify-center w-10 px-0",
        item.disabled && "opacity-50 cursor-not-allowed"
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
            <Badge variant={isActive ? "outline" : "secondary"}>
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
        {LinkContent}
        <div className="absolute left-full pl-2 ml-1 hidden group-hover:block z-50">
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
            {item.badge && (
              <Badge variant="secondary" className="mt-1">{item.badge}</Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return LinkContent;
};

const UserMenu = ({ userData, handleLogout, isCollapsed }: { 
  userData: UserData; 
  handleLogout: () => void;
  isCollapsed: boolean;
}) => (
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
          <Link href="/settings">Profile Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Billing & Plans</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const Sidebar = ({ 
  isCollapsed, 
  userData, 
  handleLogout,
  setIsCommandOpen, 
  setSidebarCollapsed 
}: {
  isCollapsed: boolean;
  userData: UserData;
  handleLogout: () => void;
  setIsCommandOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}) => (
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

    <UserMenu 
      userData={userData} 
      handleLogout={handleLogout} 
      isCollapsed={isCollapsed}
    />
  </div>
);

const Header = ({
  isSidebarCollapsed,
  setSidebarCollapsed,
  setMobileSidebarOpen,
  setIsCommandOpen,
  documents,
  userData
}: {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setIsCommandOpen: (open: boolean) => void;
  documents: Document[];
  userData: UserData;
}) => (
  <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

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

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsCommandOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
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

        <NotificationsMenu documents={documents} />
        <HelpMenu />
        <MobileUserMenu userData={userData} />
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
);
const NotificationsMenu = ({ documents }: { documents: Document[] }) => (
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
      
      {documents?.slice(0, 3).map((doc) => (
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
);

const HelpMenu = () => (
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
    </DropdownMenuContent>
  </DropdownMenu>
);

const MobileUserMenu = ({ userData }: { userData: UserData }) => (
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
);

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { getProfile } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/logout');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:bg-white dark:lg:bg-gray-900",
          isSidebarCollapsed ? "lg:w-[68px]" : "lg:w-64"
        )}
      >
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          userData={userData}
          handleLogout={handleLogout}
          setIsCommandOpen={setIsCommandOpen}
          setSidebarCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar 
            isCollapsed={false}
            userData={userData}
            handleLogout={handleLogout}
            setIsCommandOpen={setIsCommandOpen}
            setSidebarCollapsed={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Command Menu */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search across Docwelo..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {mainNavigation.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => {
                  setIsCommandOpen(false);
                  router.push(item.href);
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
                    router.push(item.href);
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
        <Header 
          isSidebarCollapsed={isSidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setMobileSidebarOpen={setMobileSidebarOpen}
          setIsCommandOpen={setIsCommandOpen}
          documents={documents}
          userData={userData}
        />

        <main className="flex-1">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}