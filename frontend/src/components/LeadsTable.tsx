import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { Search, Users, Clock, TrendingUp, Inbox } from "lucide-react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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

const stats = [
  {
    key: "total" as const,
    label: "Total Leads",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-t-primary",
  },
  {
    key: "new" as const,
    label: "Awaiting Action",
    icon: Clock,
    color: "text-secondary-foreground",
    bg: "bg-secondary/60",
    border: "border-t-secondary-foreground/40",
  },
  {
    key: "done" as const,
    label: "In Progress / Closed",
    icon: TrendingUp,
    color: "text-accent-foreground",
    bg: "bg-accent",
    border: "border-t-accent-foreground/40",
  },
];

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchLeads = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await api.get(`/leads?${params.toString()}`, {
          signal: controller.signal,
        });
        if (mountedRef.current) setLeads(res.data);
      } catch (err) {
        if (
          mountedRef.current &&
          !(err instanceof DOMException && err.name === "AbortError") &&
          !search
        ) {
          toast.error("Failed to load leads");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    const timer = setTimeout(fetchLeads, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const handleStatusChange = async (
    leadId: string,
    newStatus: Lead["status"]
  ) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    try {
      await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
      setSearch((s) => s);
    }
  };

  const counts = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      done: leads.filter(
        (l) => l.status === "contacted" || l.status === "closed"
      ).length,
    }),
    [leads]
  );

  return (
    <div className="h-full flex flex-col gap-4 min-h-0">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Lead Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, search and update all incoming leads.
        </p>
      </div>

      {/* Stat cards — shadcn default style */}
      <div className="grid gap-4 sm:grid-cols-3 shrink-0">
        {stats.map((s) => {
          const Icon = s.icon;
          const count = counts[s.key];
          return (
            <Card key={s.key} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {s.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.key === "new"
                    ? "Requires immediate attention"
                    : s.key === "done"
                    ? "Processed or in progress"
                    : "Total recorded leads"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table card */}
      <Card className="shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
              <CardDescription>
                A list of recent leads and their current status.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
          {/* Table states */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Loading leads…</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Inbox size={22} className="text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-foreground">No leads found</p>
              <p className="text-xs text-muted-foreground">
                {search
                  ? "Try adjusting your search."
                  : "Leads will appear here once submitted."}
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-auto rounded-b-lg border-t border-border">
              <Table className="h-full">
                <TableHeader className="bg-muted/80 border-b border-border sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground/80 h-11 px-4 border-r border-border/40 last:border-r-0">Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground/80 h-11 px-4 border-r border-border/40 last:border-r-0">Email</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground/80 h-11 px-4 border-r border-border/40 last:border-r-0">Budget</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground/80 h-11 px-4 border-r border-border/40 last:border-r-0">Message</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground/80 h-11 px-4 border-r border-border/40 last:border-r-0">Date</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground/80 h-11 px-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border bg-card">
                  {leads.map((lead) => (
                      <TableRow key={lead._id} className="border-b border-border transition-colors hover:bg-accent/40">
                        <TableCell className="py-3 px-4 border-r border-border/30 last:border-r-0">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground">
                              {lead.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 border-r border-border/30 last:border-r-0">
                          <span className="text-sm text-muted-foreground">
                            {lead.email}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 border-r border-border/30 last:border-r-0">
                          <Badge variant="secondary" className="font-medium">
                            {budgetLabels[lead.budgetRange] || lead.budgetRange}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-4 border-r border-border/30 last:border-r-0">
                          <Popover
                            open={openMessageId === lead._id}
                            onOpenChange={(isOpen) =>
                              setOpenMessageId(isOpen ? lead._id : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <span
                                className="block max-w-[200px] truncate text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                onMouseEnter={() => setOpenMessageId(lead._id)}
                                onMouseLeave={() => setOpenMessageId(null)}
                              >
                                {lead.message}
                              </span>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-80"
                              side="top"
                              align="start"
                              onMouseEnter={() => setOpenMessageId(lead._id)}
                              onMouseLeave={() => setOpenMessageId(null)}
                            >
                              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                                {lead.message}
                              </p>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="py-3 px-4 border-r border-border/30 last:border-r-0">
                          <span className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                            {new Date(lead.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <Select
                            value={lead.status}
                            onValueChange={(value) =>
                              handleStatusChange(lead._id, value as Lead["status"])
                            }
                          >
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                       </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
