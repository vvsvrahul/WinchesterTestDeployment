import { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type SelectOption = {
  value: string;
  label: string;
  item?: any;
  icon?: React.ComponentType<{ className?: string }>;
};
