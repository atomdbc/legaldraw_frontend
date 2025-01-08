'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ 
  value, 
  onChange, 
  className 
}: ColorPickerProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[60px] h-[30px] p-0"
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-[200px] h-[200px] cursor-pointer"
          />
        </PopoverContent>
      </Popover>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[100px] uppercase"
        maxLength={7}
      />
    </div>
  );
}