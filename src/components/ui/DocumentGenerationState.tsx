import { FileText } from 'lucide-react';

export function DocumentGenerationState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6 md:py-12">
      <div className="relative mb-6 md:mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        <div className="relative rounded-full bg-primary/10 p-6 md:p-8">
          <FileText className="h-8 w-8 md:h-12 md:w-12 text-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 w-full max-w-sm px-4 md:px-0">
        <h3 className="text-center font-medium text-base md:text-lg mb-4 md:mb-6">
          Generating Your Document
        </h3>

        <div className="space-y-3 md:space-y-4">
          {[
            { label: "Processing party information", delay: "0s" },
            { label: "Applying document variables", delay: "1s" },
            { label: "Formatting content", delay: "2s" },
            { label: "Generating final document", delay: "3s" }
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-2 md:gap-3 animate-fadeIn"
              style={{ animationDelay: step.delay }}
            >
              <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-ping" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-0 animate-progress" />
          </div>
        </div>
      </div>
    </div>
  );
}