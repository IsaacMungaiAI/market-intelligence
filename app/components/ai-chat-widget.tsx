"use client";

import * as React from "react";
import { Bot, Send, User, BrainCircuit, Loader2, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanySearch } from "@/app/components/company-search";
import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export function AIChatWidget() {
    const [open, setOpen] = React.useState(false);
    const [companies, setCompanies] = React.useState<Company[]>([]);
    const [companyId, setCompanyId] = React.useState("");
    const [question, setQuestion] = React.useState("");
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [loading, setLoading] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        fetch("/api/companies")
            .then((r) => r.json())
            .then((res) => setCompanies(res.data ?? []))
            .catch(() => {});
    }, []);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [open]);

    async function handleSend() {
        if (!question.trim() || !companyId || loading) return;

        const userMsg: Message = { role: "user", content: question };
        setMessages((prev) => [...prev, userMsg]);
        setQuestion("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyId, question }),
            });
            const json = await res.json();

            const assistantMsg: Message = {
                role: "assistant",
                content: json.data?.answer ?? json.error ?? "No response from AI service.",
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Failed to reach the AI service. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const selectedCompany = companies.find((c) => c.id === companyId);

    return (
        <>
            {/* Floating trigger button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105",
                    open
                        ? "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                )}
                aria-label={open ? "Close AI chat" : "Open AI chat"}
            >
                {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>

            {/* Chat panel */}
            <div
                className={cn(
                    "fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 ease-in-out dark:border-white/10 dark:bg-slate-900",
                    open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">
                            AI Analyst
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Ask about any company&apos;s financials
                        </p>
                    </div>
                </div>

                {/* Company selector */}
                <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                    <CompanySearch
                        companies={companies}
                        value={companyId}
                        onChange={setCompanyId}
                    />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: "380px", minHeight: "200px" }}>
                    {messages.length === 0 && !loading ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <BrainCircuit className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                                    Company Intelligence
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Select a company above, then ask a question
                                    <br />
                                    about its financials, risks, or performance.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-2.5",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                                            <BrainCircuit className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                                            msg.role === "user"
                                                ? "bg-emerald-500 text-white rounded-br-md"
                                                : "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white rounded-bl-md"
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white dark:bg-slate-600">
                                            <User className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-2.5">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <BrainCircuit className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 dark:bg-white/10">
                                        <div className="flex items-center gap-1.5">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                Analyzing...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-slate-200 px-4 py-3 dark:border-white/10">
                    {!companyId && (
                        <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">
                            Select a company above to start chatting.
                        </p>
                    )}
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            placeholder={
                                selectedCompany
                                    ? `Ask about ${selectedCompany.ticker}...`
                                    : "Select a company first"
                            }
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={!companyId || loading}
                            className="flex-1"
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!companyId || !question.trim() || loading}
                            className="shrink-0 bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
