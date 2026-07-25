import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { LayoutDashboard, LogOut } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// User card — hides text label when icon-only
function UserCard({ email }: { email: string }) {
  const { open, collapsible } = useSidebar();
  const iconOnly = collapsible === "icon" && !open;

  return (
    <div
      className={`flex items-center rounded-xl bg-sidebar-accent/70 transition-all duration-200 ${
        iconOnly ? "justify-center p-2" : "gap-3 px-3 py-3"
      }`}
      title={iconOnly ? email : undefined}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
          {email.charAt(0).toUpperCase()}
        </div>
        {/* Online indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-sidebar" />
      </div>

      {/* Labels — hidden in icon mode */}
      {!iconOnly && (
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="text-xs font-semibold text-sidebar-foreground truncate">
            {email}
          </p>
          <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">
            Administrator
          </p>
        </div>
      )}
    </div>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <SidebarProvider>
      {/* ─────────── Sidebar (floating, rounded) ──────────── */}
      <Sidebar className="m-3 h-[calc(100svh-1.5rem)] rounded-2xl shadow-lg">
        {/* Logo */}
        <SidebarHeader className="p-0 overflow-hidden rounded-t-2xl">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-[18px] hover:bg-sidebar-accent/50 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground text-sm font-extrabold shadow-sm">
              L
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[15px] font-bold text-sidebar-foreground leading-none tracking-tight">
                LeadDesk Mini
              </p>
              <p className="text-[10px] mt-1 text-sidebar-foreground/50 uppercase tracking-[0.12em]">
                Admin Portal
              </p>
            </div>
          </Link>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className="px-2 pt-3">
          <SidebarGroup className="p-0 gap-0">
            <SidebarGroupLabel className="px-3 mb-1">
              Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  size="lg"
                  tooltip="Dashboard"
                  onClick={() => navigate("/admin")}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary-foreground/10">
                    <LayoutDashboard size={14} />
                  </span>
                  <span className="truncate">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="px-2 pb-3 rounded-b-2xl overflow-hidden">
          {/* User card */}
          {user && <UserCard email={user.email} />}

          {/* Sign out */}
          <SidebarMenu className="mt-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="default"
                tooltip="Sign out"
                onClick={handleLogout}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
                  <LogOut size={13} />
                </span>
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* ─────────── Main content ──────────────────────────── */}
      <SidebarInset>
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-5">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border shrink-0" />

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm min-w-0">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              Home
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-semibold text-foreground truncate">
              Dashboard
            </span>
          </nav>

          {/* Beta badge */}
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Beta
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
