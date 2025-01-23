// src/components/documentation/DocContent.tsx
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { InfoIcon } from 'lucide-react';

interface DocContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DocHeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function DocHeading({ children, className, id }: DocHeadingProps) {
  return (
    <h2 
      id={id} 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight mt-12 mb-4",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface DocNoteProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'tip';
}

export function DocNote({ children, type = 'info' }: DocNoteProps) {
  return (
    <Alert className="my-4">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle className="capitalize">{type}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

interface DocCodeProps {
  children: string;
  language?: string;
}

export function DocCode({ children, language = 'typescript' }: DocCodeProps) {
  return (
    <Card className="my-4 p-4">
      <pre className="overflow-x-auto">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </Card>
  );
}

export function DocContent({ children, className }: DocContentProps) {
  return (
    <div className={cn("prose prose-gray dark:prose-invert max-w-none", className)}>
      {children}
    </div>
  );
}