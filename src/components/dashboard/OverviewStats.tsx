// src/components/dashboard/OverviewStats.tsx

import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  title: string;
  value: string;
  description?: string;
}

interface OverviewStatsProps {
  stats: StatItem[];
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.description && (
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}