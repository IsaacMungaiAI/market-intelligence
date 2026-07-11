"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { CompanySearch } from "@/app/components/company-search"
import type { Company } from "@/lib/types"

type AddToWatchlistDialogProps = {
  companies: Company[]
}

export function AddToWatchlistDialog({ companies }: AddToWatchlistDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [companyId, setCompanyId] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!companyId) {
      setError("Please select a company.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to add to watchlist")
      }

      setOpen(false)
      setCompanyId("")
      router.refresh()
      toast.success("Added to watchlist", {
        description: "Company is now being tracked.",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
      toast.error("Failed to add to watchlist", { description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add to Watchlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add to Watchlist</DialogTitle>
            <DialogDescription>
              Add a company to your watchlist to track its price movement and performance.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <CompanySearch
                companies={companies}
                value={companyId}
                onChange={setCompanyId}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Watchlist
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
