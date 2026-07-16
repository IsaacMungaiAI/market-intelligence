"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    BriefcaseBusiness,
    Building2,
    Eye,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    RadioTower,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { NotificationBell } from "@/app/components/notification-bell";
import { AIChatWidget } from "@/app/components/ai-chat-widget";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: BriefcaseBusiness },
    { name: "Watchlists", href: "/dashboard/watchlists", icon: Eye },
    { name: "Signals", href: "/dashboard/signals", icon: RadioTower },
    { name: "Companies", href: "/dashboard/companies", icon: Building2 },
    { name: "AI Summaries", href: "/dashboard/ai-summaries", icon: FileText },
];

type DashboardShellProps = {
    children: React.ReactNode;
    userEmail?: string | null;
};

function NavLinks({
    pathname,
    onLinkClick,
}: {
    pathname: string;
    onLinkClick?: () => void;
}) {
    return (
        <nav className="space-y-1" data-tour="sidebar-nav">
            {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                            isActive
                                ? "bg-emerald-500 text-slate-950 shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                        )}
                    >
                        <Icon />
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}

function UserInfo({
    initials,
    userEmail,
}: {
    initials: string;
    userEmail?: string | null;
}) {
    return (
        <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Signed in as
            </p>
            <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                    {initials}
                </div>
                <p className="min-w-0 truncate text-sm font-semibold">
                    {userEmail ?? "KMIP user"}
                </p>
            </div>
            <Button
                className="mt-4 w-full"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="destructive"
            >
                <LogOut />
                Log out
            </Button>
        </div>
    );
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
    const pathname = usePathname();
    const initials = getInitials(userEmail);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const prevPathnameRef = React.useRef(pathname);

    React.useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            setSidebarOpen(false);
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white/95 px-4 py-5 shadow-sm dark:border-white/10 dark:bg-slate-950/95 lg:flex lg:flex-col">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-slate-950">
                        KM
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                            KMIP
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Market intelligence
                        </p>
                    </div>
                </div>

                <div className="my-5 h-px bg-border" />

                <NavLinks pathname={pathname} />

                <UserInfo initials={initials} userEmail={userEmail} />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar panel */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform duration-200 ease-in-out dark:border-white/10 dark:bg-slate-950 lg:hidden",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-slate-950">
                            KM
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                                KMIP
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Market intelligence
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="my-5 h-px bg-border" />

                <NavLinks
                    pathname={pathname}
                    onLinkClick={() => setSidebarOpen(false)}
                />

                <UserInfo initials={initials} userEmail={userEmail} />
            </aside>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/85 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                                    Dashboard
                                </p>
                                <h1 className="text-lg font-semibold text-slate-950 dark:text-white">
                                    Portfolio overview
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <NotificationBell />
                            <ThemeToggle />
                            <Button
                                className="hidden sm:inline-flex"
                                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                                variant="outline"
                            >
                                <LogOut />
                                Log out
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>

            <div data-tour="ai-chat-trigger">
              <AIChatWidget />
            </div>
        </div>
    );
}

function getInitials(email?: string | null) {
    if (!email) return "KU";

    return email.slice(0, 2).toUpperCase();
}
