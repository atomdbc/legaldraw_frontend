// src/components/dashboard/panels/DocumentList.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DocumentList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border rounded-md border" />
      </CardContent>
    </Card>
  );
}