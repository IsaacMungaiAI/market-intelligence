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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { CompanySearch } from "@/app/components/company-search"
import type { Company, AddHoldingInput } from "@/lib/types"

type AddHoldingDialogProps = {
  companies: Company[]
}

export function AddHoldingDialog({ companies }: AddHoldingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [companyId, setCompanyId] = React.useState("")
  const [quantity, setQuantity] = React.useState("")
  const [avgCost, setAvgCost] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const qty = Number.parseInt(quantity, 10)
    const cost = Number.parseFloat(avgCost)

    if (!companyId) {
      setError("Please select a company.")
      return
    }
    if (!qty || qty <= 0) {
      setError("Quantity must be a positive number.")
      return
    }
    if (!cost || cost <= 0) {
      setError("Average cost must be a positive number.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, quantity: qty, avgCost: cost } satisfies AddHoldingInput),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to add holding")
      }

      setOpen(false)
      setCompanyId("")
      setQuantity("")
      setAvgCost("")
      router.refresh()
      toast.success("Holding added", {
        description: `${qty} shares added to your portfolio.`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
      toast.error("Failed to add holding", { description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Holding
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Holding</DialogTitle>
            <DialogDescription>
              Add a stock position to your portfolio. If you already hold this company, the quantities and costs will be blended.
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

            <div className="grid gap-2">
              <Label htmlFor="quantity">Number of shares</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avgCost">Average cost per share (KES)</Label>
              <Input
                id="avgCost"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 38.50"
                value={avgCost}
                onChange={(e) => setAvgCost(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
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
              Add Holding
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
