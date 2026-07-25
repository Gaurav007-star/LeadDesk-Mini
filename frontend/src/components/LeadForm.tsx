import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Send, CheckCircle2, User, Mail, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const leadFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  budgetRange: z.enum(["under-1k", "1k-5k", "5k-10k", "10k-plus"], {
    message: "Please select a budget range",
  }),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export function LeadForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    budgetRange: "under-1k",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        budgetRange: fieldErrors.budgetRange?.[0],
        message: fieldErrors.message?.[0],
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/leads", result.data);
      toast.success("Submitted successfully!");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-primary/[0.03] p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold">You're all set!</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We'll be in touch within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", budgetRange: "under-1k", message: "" });
          }}
          className="mt-5 text-sm font-medium text-primary hover:underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border bg-card shadow-xl shadow-primary/[0.04]">
      <div className="p-7 sm:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold tracking-tight">Get in Touch</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You can reach us anytime
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</Label>
            <div className="input-group relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="h-10 pl-9"
              />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
            <div className="input-group relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                className="h-10 pl-9"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budgetRange" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Budget</Label>
            <Select
              value={formData.budgetRange}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, budgetRange: value as LeadFormData["budgetRange"] }));
                if (errors.budgetRange) {
                  setErrors((prev) => ({ ...prev, budgetRange: undefined }));
                }
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-plus">$10,000+</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.budgetRange && <p className="text-xs text-destructive">{errors.budgetRange}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</Label>
            <div className="input-group relative">
              <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="What are you looking to build?"
                rows={3}
                className="resize-none pl-9"
              />
            </div>
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>

          <Button
            type="submit"
            className="mt-1 h-11 w-full gap-2 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send size={14} />
              </>
            )}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground/70">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
