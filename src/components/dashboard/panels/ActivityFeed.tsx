import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// src/components/dashboard/panels/ActivityFeed.tsx
export function ActivityFeed() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" />
        </CardContent>
      </Card>
    );
  }