import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────
type Collapsible = "icon" | "offcanvas" | "none";

type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  collapsible: Collapsible;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
function SidebarProvider({
  defaultOpen = true,
  collapsible = "offcanvas",
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  collapsible?: Collapsible;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggleSidebar = React.useCallback(() => setOpen((v) => !v), []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar, collapsible }}>
      <div
        data-sidebar-open={open}
        data-collapsible={collapsible}
        style={
          {
            "--sidebar-width": "15rem",
            "--sidebar-width-icon": "3.5rem",
            ...style,
          } as React.CSSProperties
        }
        className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { open, collapsible } = useSidebar();

  // Width logic per collapsible mode
  const widthClass =
    collapsible === "icon"
      ? open
        ? "w-[var(--sidebar-width)]"
        : "w-[var(--sidebar-width-icon)]"
      : collapsible === "offcanvas"
      ? open
        ? "w-[var(--sidebar-width)]"
        : "w-0"
      : "w-[var(--sidebar-width)]"; // none — always full

  return (
    <aside
      data-slot="sidebar"
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "relative flex h-svh flex-col bg-sidebar text-sidebar-foreground shrink-0 border-none outline-none",
        "transition-[width] duration-300 ease-in-out overflow-hidden",
        widthClass,
        className
      )}
      {...props}
    >
      {/* Inner div stays at full width so content never reflows */}
      <div className="flex h-full w-[var(--sidebar-width)] flex-col border-none">{children}</div>
    </aside>
  );
}

// ─── SidebarHeader ────────────────────────────────────────────────────────────
function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-2 border-none", className)}
      {...props}
    />
  );
}

// ─── SidebarFooter ────────────────────────────────────────────────────────────
function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-2 p-2 border-none", className)}
      {...props}
    />
  );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────
function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden border-none",
        className
      )}
      {...props}
    />
  );
}

// ─── SidebarGroup ─────────────────────────────────────────────────────────────
function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("relative flex w-full min-w-0 flex-col p-2 border-none", className)}
      {...props}
    />
  );
}

// ─── SidebarGroupLabel ────────────────────────────────────────────────────────
// Hides itself in icon-collapsed mode
function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, collapsible } = useSidebar();
  const hidden = collapsible === "icon" && !open;

  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 outline-none transition-[opacity,height] duration-200",
        hidden && "opacity-0 pointer-events-none h-0 overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

// ─── SidebarMenu ──────────────────────────────────────────────────────────────
function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

// ─── SidebarMenuItem ──────────────────────────────────────────────────────────
function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

// ─── SidebarMenuButton ────────────────────────────────────────────────────────
// In icon-collapsed mode: centers icon, hides label text
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean;
    size?: "sm" | "default" | "lg";
    tooltip?: string;
  }
>(({ className, isActive, size = "default", children, tooltip, ...props }, ref) => {
  const { open, collapsible } = useSidebar();
  const iconOnly = collapsible === "icon" && !open;

  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-9 text-sm",
    lg: "h-10 text-sm",
  };

  return (
    <button
      ref={ref}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      title={iconOnly && tooltip ? tooltip : undefined}
      className={cn(
        "peer/menu-button flex w-full items-center overflow-hidden rounded-xl text-left font-medium outline-none ring-sidebar-ring",
        "transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:ring-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
          : "text-sidebar-foreground/75",
        iconOnly ? "justify-center px-0" : "gap-3 px-3",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {iconOnly
        ? // In icon mode only render the first child (the icon span)
          React.Children.toArray(children)[0]
        : children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

// ─── SidebarSeparator ─────────────────────────────────────────────────────────
function SidebarSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-separator"
      className={cn("mx-2 h-px bg-sidebar-border", className)}
      {...props}
    />
  );
}

// ─── SidebarInset ─────────────────────────────────────────────────────────────
function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background overflow-hidden",
        "transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    />
  );
}

// ─── SidebarTrigger ───────────────────────────────────────────────────────────
function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-slot="sidebar-trigger"
      type="button"
      onClick={(e) => {
        toggleSidebar();
        onClick?.(e);
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md",
        "text-muted-foreground hover:bg-accent hover:text-foreground",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
// eslint-disable-next-line react-refresh/only-export-components
  useSidebar,
};
