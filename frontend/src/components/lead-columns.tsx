import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

const budgetLabels: Record<string, string> = {
  "under-1k": "Under $1K",
  "1k-5k": "$1K – $5K",
  "5k-10k": "$5K – $10K",
  "10k-plus": "$10K+",
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  new: { label: "New", variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  closed: { label: "Closed", variant: "outline" },
};

export function getLeadColumns(
  onStatusChange: (leadId: string, status: Lead["status"]) => void
): ColumnDef<Lead>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {(row.getValue("name") as string).charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-foreground">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("email")}
        </span>
      ),
    },
    {
      accessorKey: "budgetRange",
      header: "Budget",
      cell: ({ row }) => {
        const budget = row.getValue("budgetRange") as string;
        return (
          <Badge variant="secondary" className="font-medium">
            {budgetLabels[budget] || budget}
          </Badge>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => <MessageCell message={row.getValue("message") as string} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
          {new Date(row.getValue("createdAt") as string).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" }
          )}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const lead = row.original;
        const config = statusConfig[lead.status];
        return (
          <div className="flex items-center gap-2">
            <Badge variant={config?.variant}>{config?.label}</Badge>
            <div className="relative">
              <select
                value={lead.status}
                onChange={(e) =>
                  onStatusChange(lead._id, e.target.value as Lead["status"])
                }
                className="appearance-none cursor-pointer rounded-lg border border-border bg-background py-1 pl-2.5 pr-6 text-xs text-foreground transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <ChevronDown
                size={10}
                className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
        );
      },
    },
  ];
}

function MessageCell({ message }: { message: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          className="block max-w-[200px] truncate text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {message}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        side="top"
        align="start"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">{message}</p>
      </PopoverContent>
    </Popover>
  );
}
