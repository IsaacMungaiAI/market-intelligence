"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  User,
  BrainCircuit,
  Loader2,
} from "lucide-react";
import { CompanySearch } from "@/app/components/company-search";
import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAnalystPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [companyId, setCompanyId] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((res) => setCompanies(res.data ?? []))
      .catch(() => {});
  }, []);

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
        content: json.data?.answer ?? json.error ?? "No response",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to reach AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const selectedCompany = companies.find((c) => c.id === companyId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Analyst</h1>
        <p className="text-muted-foreground">
          Ask questions about any company&apos;s annual reports and financial data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat with your data
          </CardTitle>
          <CardDescription>
            Select a company, then ask questions about its financials, risks, or performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CompanySearch
            companies={companies}
            value={companyId}
            onChange={setCompanyId}
          />

          {messages.length > 0 && (
            <div className="max-h-96 space-y-4 overflow-y-auto rounded-lg border bg-slate-50 p-4 dark:bg-slate-950/60">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 rounded-lg p-3",
                    msg.role === "user"
                      ? "bg-white dark:bg-slate-900"
                      : "bg-emerald-50 dark:bg-emerald-900/20"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      msg.role === "user"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-emerald-500 text-white"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <BrainCircuit className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {msg.role === "user" ? "You" : "AI Analyst"}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2" data-tour="ai-analyst-input">
            <Input
              placeholder={
                companyId
                  ? `Ask about ${selectedCompany?.ticker ?? "this company"}...`
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
            />
            <Button
              onClick={handleSend}
              disabled={!companyId || !question.trim() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
