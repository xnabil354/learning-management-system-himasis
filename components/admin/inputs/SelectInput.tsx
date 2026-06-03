"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectInputProps extends DocumentHandle {
  path: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

function SelectInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <Skeleton className="h-10 w-full bg-slate-50" />
    </div>
  );
}

function SelectInputField({
  path,
  label,
  options,
  placeholder,
  ...handle
}: SelectInputProps) {
  const { data: value } = useDocument({ ...handle, path });
  const editValue = useEditDocument({ ...handle, path });

  if (options.length <= 4) {
    return (
      <div className="space-y-3">
        <Label className="text-slate-300">{label}</Label>
        <RadioGroup
          value={(value as string) ?? ""}
          onValueChange={(newValue) => editValue(newValue)}
          className="flex flex-wrap gap-4"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${path}-${option.value}`}
                className="border-slate-600 text-blue-600"
              />

              <Label
                htmlFor={`${path}-${option.value}`}
                className="font-normal cursor-pointer text-slate-300"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={path} className="text-slate-300">
        {label}
      </Label>
      <Select
        value={(value as string) ?? ""}
        onValueChange={(newValue) => editValue(newValue)}
      >
        <SelectTrigger
          id={path}
          className="bg-slate-50 border-slate-200 text-slate-300"
        >
          <SelectValue placeholder={placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent className="bg-slate-50 border-slate-200">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-slate-300 focus:bg-slate-700 focus:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SelectInput(props: SelectInputProps) {
  return (
    <Suspense fallback={<SelectInputFallback label={props.label} />}>
      <SelectInputField {...props} />
    </Suspense>
  );
}
