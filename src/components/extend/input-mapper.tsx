import React, { useCallback } from "react";
import { InputSelect, InputSelectTrigger } from "./input-select";
import { Input } from "../ui/input";
import { InputField } from "@/types";
import { Label } from "../ui/label";
import { DatePicker } from "./date-picker";

/**
 * A dynamic input mapper component that renders different types of input fields
 * based on the provided field configuration. Supports 'select', 'date', and 'input' types.
 * Handles validation errors and touched states for form integration.
 * @param {Object} props - The properties for the InputMapper component.
 * @param {InputField} props.field - The configuration for the input field.
 * @param {any} props.value - The current value of the input field.
 * @param {function} props.onChange - The change handler for the input field.
 * @param {function} props.onBlur - The blur handler for the input field.
 * @param {string | undefined} props.error - The validation error message for the input field.
 * @param {boolean | undefined} props.touched - The touched state of the input field.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @returns {JSX.Element} The rendered input field component.
 */
export default function InputMapper({
  field,
  value,
  error,
  touched,
  className = "",
  options = [],
  inputType = "text",
  onChange,
  onBlur,
  onSelectionChange = () => {},
  onValueChange = () => {},
}: {
  field: InputField<any>;
  value: any;
  error: string | undefined;
  touched: boolean | undefined;
  className?: string;
  options?: { label: string; value: string; item?: any }[];
  inputType?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onSelectionChange?: (v: string, item: any) => void;
  onValueChange?: (v: string, item: any) => void;
}): React.JSX.Element {
  const { label, name, type, placeholder, disabled, required = false } = field;

  const getInputField = useCallback(
    ({
      type,
      error,
      touched,
      options = [],
    }: {
      type: "select" | "date" | "input";
      error: string | undefined;
      touched: boolean | undefined;
      options?: { label: string; value: string }[];
    }): React.JSX.Element => {
      switch (type) {
        case "select":
          return (
            <InputSelect
              className="[&>*]text-base opacity-100"
              disabled={disabled}
              options={options}
              value={value}
              onValueChange={(val, item) => {
                const event = {
                  target: {
                    name: name,
                    value: val,
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange?.(event);
                onValueChange(val, item);
              }}
              clearable
              placeholder={placeholder}
              onSelectionChange={onSelectionChange}
            >
              {(provided) => (
                <InputSelectTrigger
                  {...provided}
                  className={`${error && touched ? "border-destructive" : ""}`}
                />
              )}
            </InputSelect>
          );
        case "date":
          return (
            <DatePicker
              disabled={disabled}
              name={name}
              value={(value && new Date(value)) || undefined}
              onChangeAction={onChange || (() => {})}
              placeholder={placeholder}
              onBlurAction={onBlur || (() => {})}
              className={error && touched ? "border-destructive" : ""}
            />
          );
        default:
          return (
            <Input
              type={inputType}
              disabled={disabled}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={error && touched ? "border-destructive" : ""}
            />
          );
      }
    },
    [
      type,
      name,
      value,
      options,
      onChange,
      onBlur,
      disabled,
      placeholder,
      inputType,
      error,
      touched,
      onValueChange,
      onSelectionChange,
    ]
  );

  return type ? (
    <div className={`min-w-[150px] ${className}`}>
      <Label
        htmlFor={name}
        className="px-1 mb-1 !text-lg font-semibold text-gray-700"
      >
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {getInputField({ type, error, touched, options })}
      {error && touched ? (
        <div className="text-xs text-destructive">{error}</div>
      ) : null}
    </div>
  ) : (
    <div>Unsupported field type</div>
  );
}
