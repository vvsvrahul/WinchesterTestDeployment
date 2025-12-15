import { CheckIcon, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SelectOption, SetState } from "@/types";
import {
  CSSProperties,
  FC,
  FormEvent,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from "react";

export interface InputSelectProvided {
  options: SelectOption[];
  onValueChange?: (v: string, item: any) => void;
  placeholder: string;
  clearable: boolean;
  disabled: boolean;
  selectedValue: string;
  setSelectedValue: SetState<string>;
  isPopoverOpen: boolean;
  setIsPopoverOpen: SetState<boolean>;
  onOptionSelect: (v: string, item: any) => void;
  onClearAllOptions: () => void;
}

export const InputSelect: FC<{
  options: SelectOption[];
  value?: string;
  onValueChange?: (v: string, item: any) => void;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children: (v: InputSelectProvided) => ReactNode;
  onFilter?: (v: FormEvent<HTMLInputElement>) => void;
  onSelectionChange?: (v: string, item: any) => void;
  shoudlFilter?: boolean;
}> = ({
  options,
  value = "",
  onValueChange,
  placeholder = "Select...",
  clearable = false,
  disabled = false,
  className,
  children,
  onFilter,
  shoudlFilter = true,
  onSelectionChange,
  ...restProps
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onOptionSelect = (option: string, item: any) => {
    setSelectedValue(option);
    onValueChange?.(option, item);
    setIsPopoverOpen(false);
    onSelectionChange?.(option, item);
  };

  const onClearAllOptions = () => {
    setSelectedValue("");
    onValueChange?.("", null);
    setIsPopoverOpen(false);
    onSelectionChange?.("", null);
  };

  // Sync selectedValue with external value prop
  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        {children({
          options,
          onValueChange,
          placeholder,
          clearable,
          disabled,
          selectedValue,
          setSelectedValue,
          isPopoverOpen,
          setIsPopoverOpen,
          onOptionSelect,
          onClearAllOptions,
        })}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 bg-white border border-gray-200 shadow-lg",
          className
        )}
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
        {...restProps}
      >
        <Command shouldFilter={shoudlFilter}>
          <CommandInput
            placeholder={placeholder || "Search..."}
            onChangeCapture={onFilter}
            className="text-gray-800 placeholder:text-gray-300 text-base"
          />
          <CommandList className="max-h-[unset] overflow-y-hidden !text-base">
            <CommandEmpty className="text-gray-800 text-center py-2 text-sm">
              No results found.
            </CommandEmpty>
            <CommandGroup className="max-h-[20rem] min-h-[10rem] overflow-y-auto text-base">
              {options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onOptionSelect(option.value, option.item)}
                    className="cursor-pointer text-gray-800 hover:!bg-red-800 hover:!text-white transition-colors data-[selected=true]:!bg-red-800 data-[selected=true]:!text-white"
                  >
                    <div
                      className={cn(
                        "mr-1 flex h-4 w-4 items-center justify-center",
                        isSelected ? "text-primary" : "invisible"
                      )}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="text-base">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {selectedValue && clearable && (
                  <>
                    <CommandItem
                      onSelect={onClearAllOptions}
                      className="justify-center flex-1 cursor-pointer text-gray-800 hover:bg-red-800 hover:text-white transition-colors"
                    >
                      Clear
                    </CommandItem>
                    <Separator
                      orientation="vertical"
                      className="flex h-full mx-2 min-h-6"
                    />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className="justify-center flex-1 max-w-full cursor-pointer text-gray-800 hover:bg-red-800 hover:text-white transition-colors"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
InputSelect.displayName = "InputSelect";

export const InputSelectTrigger = forwardRef<
  HTMLButtonElement,
  InputSelectProvided & {
    className?: string;
    children?: (v: SelectOption) => ReactNode;
    style?: CSSProperties;
  }
>(
  (
    {
      options,
      // onValueChange,
      placeholder,
      clearable,
      disabled,
      selectedValue,
      // setSelectedValue,
      // isPopoverOpen,
      setIsPopoverOpen,
      // onOptionSelect,
      onClearAllOptions,
      className,
      style,
      children,
    },
    ref
  ) => {
    const onTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    return (
      <Button
        ref={ref}
        onClick={onTogglePopover}
        variant="outline"
        type="button"
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between p-1 [&_svg]:pointer-events-auto",
          "hover:bg-transparent",
          disabled && "[&_svg]:pointer-events-none",
          className
        )}
        style={style}
      >
        {selectedValue ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center px-2 flex-1 min-w-0">
              {[selectedValue].map((value, index) => {
                const option = options.find((o) => o.value === value);

                if (!option) {
                  return <div key={`${index}-${value}`}></div>;
                }

                if (children) {
                  return (
                    <div key={`${index}-${value}`} className="truncate">
                      {children(option)}
                    </div>
                  );
                }

                return (
                  <div
                    key={`${index}-${value}`}
                    className={cn("text-foreground truncate flex items-center")}
                  >
                    {option?.icon && (
                      <option.icon className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                    )}
                    <span className="truncate">{option?.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between flex-shrink-0">
              {selectedValue && clearable && (
                <>
                  <X
                    className={cn(
                      "mx-1 h-4 cursor-pointer text-muted-foreground"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearAllOptions();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                </>
              )}
              <ChevronDown
                className={`h-4 mx-1 cursor-pointer text-muted-foreground ${className}`}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full mx-auto">
            <span className="mx-3 text-base text-muted-foreground">
              {placeholder}
            </span>
            <ChevronDown
              className={`h-4 mx-1 cursor-pointer text-muted-foreground ${className}`}
            />
          </div>
        )}
      </Button>
    );
  }
);
InputSelectTrigger.displayName = "InputSelectTrigger";
