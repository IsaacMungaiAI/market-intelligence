"use client";

import { useCallback, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "dark";
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            localStorage.setItem("theme", next);
            document.documentElement.classList.toggle("dark", next === "dark");
            return next;
        });
    }, []);

    return (
        <Button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
            size="icon"
            variant="outline"
        >
            {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
    );
}
