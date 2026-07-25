import { Link } from "react-router-dom";
import { LeadForm } from "@/components/LeadForm";
import { ArrowRight, Mail, Phone } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              L
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              LeadDesk Mini
            </span>
          </div>

          {/* Nav */}
          {/* <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground border-b-2 border-primary pb-0.5">Home</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav> */}

          {/* Admin link */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main>
        <section className="mx-auto max-w-6xl px-6 py-5 ">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_480px] lg:gap-20">
            {/* ── Left column ──────────────────────────────────── */}
            <div className="flex flex-col gap-5">
              {/* Beta badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                  Beta — Now Live
                </span>
              </div>

              {/* Heading */}
              <div className="w-full h-max mb-10">
                <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                  Capture every
                  <br />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    lead that matters
                  </span>
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground max-w-sm">
                  Drop your details and our team will reach out within 24 hours.
                  No fluff — just a focused conversation about growing your
                  pipeline.
                </p>
              </div>

              {/* Bullet points */}
              <ul className="flex flex-col gap-3">
                {[
                  "Reply guaranteed within 24 hours",
                  "Free to start — no credit card required",
                  "Zero spam, only relevant follow-ups",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <svg
                        className="h-3 w-3 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            {/* ── End left column ───────────────────────────────── */}

            {/* ── Right column: Form card ───────────────────────── */}
            <div>
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden bg-muted/50">

        {/* Main footer body */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">

            {/* ── Brand block ─────────────────────────── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Logo mark */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-extrabold shadow-md shadow-primary/30">
                  L
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight text-foreground leading-none">
                    LeadDesk Mini
                  </p>
                  <p className="text-[10px] mt-1 uppercase tracking-[0.12em] text-muted-foreground/60">
                    Admin Portal
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground/60 max-w-[220px]">
                Capture every lead that matters — no fluff, just pipeline growth.
              </p>
            </div>

            {/* ── Contact links ───────────────────────── */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-muted-foreground/50">
                Contact
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:hello@LeadDeskMini.io"
                  className="group inline-flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/50 px-3.5 py-2 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                >
                  <Mail size={13} className="text-primary/70 group-hover:text-primary transition-colors" />
                  hello@LeadDeskMini.io
                </a>
                <a
                  href="tel:+18005550100"
                  className="group inline-flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/50 px-3.5 py-2 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                >
                  <Phone size={13} className="text-primary/70 group-hover:text-primary transition-colors" />
                  +1-800-555-0100
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 sm:flex-row">
            <p className="text-[11px] tabular-nums text-muted-foreground/50">
              © {new Date().getFullYear()} LeadDesk Mini. All rights reserved.
            </p>
            <p className="text-[11px] text-muted-foreground/50">
              Built for Digital Heroes Training Task –{" "}
              <a
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-muted-foreground/70 underline underline-offset-4 decoration-border/50 transition-colors hover:text-foreground hover:decoration-primary/40"
              >
                digitalheroesco.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
