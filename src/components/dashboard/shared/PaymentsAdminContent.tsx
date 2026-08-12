"use client";

import { useState, useEffect } from "react";
import { paymentsApi, PaymentRecord } from "@/lib/api/payments";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { CreditCard } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export function PaymentsAdminContent() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [page, setPage] = useState(1);

  const fetchPayments = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await paymentsApi.listPaymentsAdmin({ page: currentPage, limit: 10 });
      if (res.data) setPayments(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error("Error loading admin payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Payments Registry</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit all financial payments, Stripe session refs, and transactions</p>
        </div>
      </div>

      {isLoading ? (
        <Loading text="Loading payments ledger..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Transaction Ref</th>
                  <th className="p-4">Booking #</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-foreground">
                      {p.transactionRef || p.stripeSessionId || p.id.slice(0, 10)}
                    </td>
                    <td className="p-4 font-semibold text-primary">{p.booking?.bookingNumber || "&mdash;"}</td>
                    <td className="p-4 font-medium text-foreground">{p.paymentMethod}</td>
                    <td className="p-4 font-extrabold text-foreground">${p.amount} {p.currency}</td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(p.status)}>{p.status}</Badge>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(p) => setPage(p)}
            className="p-4"
          />
        </div>
      )}
    </div>
  );
}