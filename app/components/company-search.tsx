"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import type { Company } from "@/lib/types"

type CompanySearchProps = {
  companies: Company[]
  value: string
  onChange: (companyId: string) => void
}

export function CompanySearch({ companies, value, onChange }: CompanySearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const selected = companies.find((c) => c.id === value)

  const filtered = query
    ? companies.filter(
        (c) =>
          c.ticker.toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase())
      )
    : companies

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                {selected.ticker}
              </span>
              {selected.name}
            </span>
          ) : (
            "Select a company..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search ticker or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent px-0 py-2 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No companies found.
            </div>
          )}
          {filtered.map((company) => (
            <button
              key={company.id}
              onClick={() => {
                onChange(company.id)
                setOpen(false)
                setQuery("")
              }}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-muted",
                value === company.id && "bg-muted"
              )}
            >
              <span className="flex h-6 w-10 shrink-0 items-center justify-center rounded bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                {company.ticker}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{company.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {company.sector ?? "—"}
                </p>
              </div>
              {value === company.id && (
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
