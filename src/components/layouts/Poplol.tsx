import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function Poplol({
  UsersData,
  value,
  setValue,
}: {
  UsersData: any[];
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? UsersData.find((user) => {
                return (
                  user.value.toString().toLowerCase() ==
                  value.toString().toLowerCase()
                );
              })?.label || value
            : "To..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            onValueChange={(search: string) => setValue(search)}
            value={value}
          />
          <CommandEmpty>No User Founded</CommandEmpty>
          <CommandGroup>
            {UsersData.map((data) => (
              <CommandItem
                key={data.value}
                value={data.label}
                onSelect={(currentValue: string) => {
                  setValue(data.value.toString());
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value == data.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {data.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
