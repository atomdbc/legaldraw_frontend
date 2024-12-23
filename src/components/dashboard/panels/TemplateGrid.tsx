// src/components/dashboard/panels/TemplateGrid.tsx
export function TemplateGrid() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" />
      </Card>
    );
  }
  