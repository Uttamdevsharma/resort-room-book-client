"use client";

import { useState, useEffect } from "react";
import { refundsApi, RefundRecord } from "@/lib/api/refunds";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Receipt } from "lucide-react";

export default function CustomerRefundsPage() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRefunds() {
      try {
        const res = await refundsApi.getMyRefunds();
        if (res.data) setRefunds(res.data);
      } catch (err) {
        console.error("Error loading refunds:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRefunds();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Refund History</h1>
        <p className="text-sm text-muted-foreground mt-1">Track refund processing for cancelled or modified bookings</p>
      </div>

      {isLoading ? (
        <Loading text="Loading refund logs..." />
      ) : refunds.length === 0 ? (
        <EmptyState title="No Refund Records" description="You have no recorded refund transactions." />
      ) : (
        <div className="space-y-4">
          {refunds.map((r) => (
            <div key={r.id} className="p-6 bg-card border border-border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(r.status)}>{r.status}</Badge>
                  <span className="text-sm text-muted-foreground">ID: {r.id.slice(0, 8)}</span>
                </div>
                {r.reason && (
                  <p className="text-xs text-muted-foreground mt-2 italic">"{r.reason}"</p>
                )}
                <span className="text-xs text-muted-foreground block mt-1">
                  Issued on {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Refund Amount</span>
                <span className="text-xl font-extrabold text-emerald-600">${r.amount} {r.currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
