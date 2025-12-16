"use client";

import * as React from "react";
import { Check, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserSearchComboboxProps {
  onSelectUser: (userId: string) => void;
  selectedUserId: string;
}

export function UserSearchCombobox({
  onSelectUser,
  selectedUserId,
}: UserSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [displayValue, setDisplayValue] = React.useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: userData, isLoading: isSearching } = useGetData<{
    items: UserOption[];
  }>({
    url: "/users",
    key: ["user-search", debouncedSearchTerm],
    params: { search: debouncedSearchTerm, limit: 10, role: "MEMBER" },
    options: {
      enabled: debouncedSearchTerm.length > 2,
      initialData: { items: [] },
    },
  });

  const selectedUser = userData?.items.find((u) => u.id === selectedUserId);

  React.useEffect(() => {
    if (selectedUser) {
      setDisplayValue(`${selectedUser.name} (${selectedUser.email})`);
    } else if (!selectedUserId) {
      setDisplayValue("");
    }
  }, [selectedUserId, selectedUser]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isSearching}
        >
          {displayValue ||
            (selectedUserId
              ? "Searching..."
              : "Search member by name/email...")}
          {isSearching && (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search member..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {isSearching && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />{" "}
              Searching...
            </div>
          )}

          <CommandEmpty>
            {debouncedSearchTerm.length < 3
              ? "Start typing to search members."
              : "No members found."}
          </CommandEmpty>

          <CommandGroup>
            {userData?.items.map((user) => (
              <CommandItem
                key={user.id}
                value={`${user.name} ${user.email}`}
                onSelect={() => {
                  onSelectUser(user.id);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedUserId === user.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
