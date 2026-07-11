"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2, X, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AppNotification, UnreadCount } from "@/lib/types";

export function NotificationBell() {
    const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const fetchUnreadCount = React.useCallback(async () => {
        try {
            const res = await fetch("/api/notifications?unread=true");
            if (res.ok) {
                const json = await res.json();
                setUnreadCount((json.data as UnreadCount)?.count ?? 0);
            }
        } catch {
            // silent
        }
    }, []);

    const fetchNotifications = React.useCallback(async () => {
        try {
            setLoading(true);
            const [listRes, unreadRes] = await Promise.all([
                fetch("/api/notifications"),
                fetch("/api/notifications?unread=true"),
            ]);

            if (listRes.ok) {
                const json = await listRes.json();
                setNotifications(json.data as AppNotification[] ?? []);
            }
            if (unreadRes.ok) {
                const json = await unreadRes.json();
                setUnreadCount((json.data as UnreadCount)?.count ?? 0);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    const unreadCountMountedRef = React.useRef(false);
    React.useEffect(() => {
        if (!unreadCountMountedRef.current) {
            unreadCountMountedRef.current = true;
            return;
        }
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const openMountedRef = React.useRef(false);
    React.useEffect(() => {
        if (!openMountedRef.current) {
            openMountedRef.current = true;
            return;
        }
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- setLoading is async-gated via fetchNotifications
            fetchNotifications();
        }
    }, [open, fetchNotifications]);

    async function handleMarkRead(id: string) {
        await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    async function handleMarkAllRead() {
        await fetch("/api/notifications/read-all", { method: "POST" });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 text-xs"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 sm:w-96 p-0"
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleMarkAllRead}
                            className="gap-1 text-xs"
                        >
                            <CheckCheck />
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground">
                            <Inbox className="h-8 w-8" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className={cn(
                                        "group relative flex gap-3 px-4 py-3 transition hover:bg-muted/50",
                                        !n.read && "bg-primary/[0.02]"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p
                                                className={cn(
                                                    "text-sm",
                                                    !n.read && "font-semibold"
                                                )}
                                            >
                                                {n.title}
                                            </p>
                                            {!n.read && (
                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                            {n.body}
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground/60">
                                            {formatRelativeTime(n.createdAt)}
                                        </p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                                                onClick={() => {
                                                    if (!n.read) handleMarkRead(n.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                View details
                                            </Link>
                                        )}
                                    </div>
                                    {!n.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                                            onClick={() => handleMarkRead(n.id)}
                                            aria-label="Mark as read"
                                        >
                                            <X />
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function formatRelativeTime(date: Date | string) {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return "just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return new Date(date).toLocaleDateString();
}
