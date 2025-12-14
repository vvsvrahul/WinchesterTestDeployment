"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  value,
  onChangeAction,
  placeholder,
  name,
  onBlurAction,
  className,
  popoverClassName,
  disabled = false,
}: {
  value: Date | undefined;
  onChangeAction: (e: React.ChangeEvent<any>) => void;
  onBlurAction: (e: React.FocusEvent<any>) => void;
  placeholder?: string;
  name: string;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value ? value.toLocaleDateString() : ""
  );

  React.useEffect(() => {
    if (value) {
      setInputValue(value.toLocaleDateString());
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const sanitizedValue = inputVal.replace(/[^\d\/\-]/g, '');
    setInputValue(sanitizedValue);
    
    if (sanitizedValue) {
      const dateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const match = sanitizedValue.match(dateRegex);
      
      if (match) {
        const [, month, day, year] = match;
        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        if (
          !isNaN(parsedDate.getTime()) &&
          parsedDate.getMonth() === parseInt(month) - 1 &&
          parsedDate.getDate() === parseInt(day)
        ) {
          onChangeAction({
            target: {
              value: parsedDate.toISOString(),
              name,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue) {
      const sanitizedValue = inputValue.replace(/[^\d\/\-]/g, '');
      const dateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const match = sanitizedValue.match(dateRegex);
      
      if (match) {
        const [, month, day, year] = match;
        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        if (
          !isNaN(parsedDate.getTime()) &&
          parsedDate.getMonth() === parseInt(month) - 1 &&
          parsedDate.getDate() === parseInt(day)
        ) {
          setInputValue(parsedDate.toLocaleDateString());
          onBlurAction({
            target: {
              value: parsedDate.toISOString(),
              name,
            },
          } as React.FocusEvent<HTMLInputElement>);
        }
      }
    }
    onBlurAction(e);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full cursor-pointer">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace", "Delete", "Tab", "Escape", "Enter",
                "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
                "Home", "End"
              ];
              
              if (e.ctrlKey || e.metaKey) {
                if (["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
                  return;
                }
              }
              
              const isNumber = /^[0-9]$/.test(e.key);
              const isSeparator = e.key === "/" || e.key === "-";
              
              if (!allowedKeys.includes(e.key) && !isNumber && !isSeparator) {
                e.preventDefault();
              }
            }}
            placeholder={placeholder || "MM/DD/YYYY"}
            disabled={disabled}
            name={name}
            className={`pr-10 ${className}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent pointer-events-auto"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`w-auto overflow-hidden p-0 ${popoverClassName}`}
        align="center"
        sideOffset={4}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            return;
          }
          
          const allowedKeys = [
            "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
            "Escape", "Tab", "Enter", " "
          ];
          const isTextInput = e.key.length === 1 && 
            !e.ctrlKey && 
            !e.metaKey && 
            !e.altKey &&
            !allowedKeys.includes(e.key);
          
          if (isTextInput) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <Calendar
          onDayBlur={(date) => {
            onBlurAction({
              target: {
                value: date.toISOString(),
                name,
              },
            } as React.FocusEvent<HTMLInputElement>);
          }}
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (date) {
              setInputValue(date.toLocaleDateString());
              onChangeAction({
                target: {
                  value: date.toISOString(),
                  name,
                },
              } as React.ChangeEvent<HTMLInputElement>);
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
