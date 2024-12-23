// src/components/dashboard/DashboardNav.tsx

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { NavItem } from "@/config/dashboard";

interface DashboardNavProps {
  items: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon as keyof typeof Icons] ?? Icons.Circle;
        return (
          <Link key={index} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4",
                pathname === item.href && "bg-accent"
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.title}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}