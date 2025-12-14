export type InputField<T> = {
  label: string;
  name: T;
  type: "select" | "date" | "input";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options?: { label: string; value: string }[];
  inputType?: "text" | "number" | "email" | "password";
};
