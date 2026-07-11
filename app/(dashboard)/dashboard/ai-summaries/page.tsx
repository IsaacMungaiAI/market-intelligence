"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { CompanySearch } from "@/app/components/company-search";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/lib/types";

const STRING_KEYS = ["summary", "content", "text", "result", "output", "data"];

function extractSummaryContent(raw: unknown): string {
  if (raw == null) return "Generated";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  if (Array.isArray(raw)) {
    if (raw.length === 0) return "Generated";
    if (raw.length === 1) return extractSummaryContent(raw[0]);
    return raw.map((item, i) => `## Section ${i + 1}\n\n${extractSummaryContent(item)}`).join("\n\n");
  }
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of STRING_KEYS) {
      if (typeof obj[key] === "string" && obj[key]) return obj[key] as string;
    }
    const sections: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value == null) continue;
      const heading = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (typeof value === "string") {
        sections.push(`## ${heading}\n\n${value}`);
      } else if (Array.isArray(value)) {
        const items = value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v, null, 2)))
          .join("\n");
        sections.push(`## ${heading}\n\n${items}`);
      } else if (typeof value === "object") {
        sections.push(`## ${heading}\n\n${JSON.stringify(value, null, 2)}`);
      } else {
        sections.push(`## ${heading}\n\n${String(value)}`);
      }
    }
    return sections.length > 0 ? sections.join("\n\n") : JSON.stringify(raw, null, 2);
  }
  return String(raw);
}

function SummaryRenderer({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);
  return (
    <div className="space-y-4 text-sm leading-7">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="text-base font-semibold text-foreground"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2
              key={i}
              className="text-lg font-bold text-foreground"
            >
              {trimmed.replace(/^#\s+/, "")}
            </h2>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s+/, ""));
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1">
              {items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap text-muted-foreground">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

type SummaryType = "executive" | "investor" | "beginner" | "sentiment";

const summaryLabels: Record<SummaryType, string> = {
  executive: "Executive Summary",
  investor: "Investor Summary",
  beginner: "Beginner Summary",
  sentiment: "Sentiment Analysis",
};

const summaryDescriptions: Record<SummaryType, string> = {
  executive: "High-level overview for C-suite readers",
  investor: "Detailed analysis for current and potential investors",
  beginner: "Jargon-free explanation for beginners",
  sentiment: "Tone and language pattern analysis",
};

export default function AISummariesPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [companyId, setCompanyId] = React.useState("");
  const [summaryType, setSummaryType] = React.useState<SummaryType>("executive");
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((res) => setCompanies(res.data ?? []))
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (!companyId) return;
    fetch(`/api/ai/summaries/${companyId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data?.summaries) {
          const match = res.data.summaries.find(
            (s: { type: string }) => s.type === summaryType.toUpperCase()
          );
          if (match) {
            setSummary(match.summary);
            return;
          }
        }
        setSummary(null);
      })
      .catch(() => setSummary(null));
  }, [companyId, summaryType]);

  async function handleGenerate() {
    if (!companyId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/summaries/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, summaryType }),
      });
      const json = await res.json();

      if (json.error) {
        setError(json.error);
        setSummary(null);
        toast.error("Generation failed", { description: json.error });
      } else {
        const extracted = extractSummaryContent(json.data);
        setSummary(extracted);
        toast.success("Summary generated", {
          description: `${summaryLabels[summaryType]} is ready.`,
        });
      }
    } catch {
      const msg = "Failed to reach AI service.";
      setError(msg);
      setSummary(null);
      toast.error("Generation failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  const selectedCompany = companies.find((c) => c.id === companyId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Summaries</h1>
        <p className="text-muted-foreground">
          Generate and view AI-powered summaries of company annual reports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Summarizer
              </CardTitle>
              <CardDescription>
                Select a company and summary type to generate insights from financial reports.
              </CardDescription>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!companyId || loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <CompanySearch
              companies={companies}
              value={companyId}
              onChange={setCompanyId}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(summaryLabels) as SummaryType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSummaryType(type)}
                className="text-left"
              >
                <Badge
                  variant={summaryType === type ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                >
                  <div>
                    <p className="text-xs font-semibold">
                      {summaryLabels[type]}
                    </p>
                    <p className="text-[10px] opacity-70">
                      {summaryDescriptions[type]}
                    </p>
                  </div>
                </Badge>
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
              {error}
            </div>
          )}

          {summary && !error && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">
                  {summaryLabels[summaryType]}
                </CardTitle>
                <CardDescription>
                  {selectedCompany?.name ?? "Company"} &mdash;{" "}
                  {summaryDescriptions[summaryType]}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <SummaryRenderer content={summary} />
              </CardContent>
            </Card>
          )}

          {!summary && !error && companyId && (
            <p className="text-center text-sm text-muted-foreground">
              No existing summary found. Click &ldquo;Generate&rdquo; to create one.
            </p>
          )}

          {!companyId && (
            <p className="text-center text-sm text-muted-foreground">
              Select a company to view or generate summaries.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
