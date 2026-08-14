"use client";

import { useState, useEffect } from "react";
import { paymentsApi, PaymentRecord } from "@/lib/api/payments";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { PaymentsSkeleton } from "@/components/dashboard/shared/CustomerSkeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { CreditCard, Calendar } from "lucide-react";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await paymentsApi.getMyPayments();
        if (res.data) setPayments(res.data);
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Payment History</h1>
        <p className="text-sm text-muted-foreground mt-1">Audit past card and checkout transactions</p>
      </div>

      {isLoading ? (
        <PaymentsSkeleton />
      ) : payments.length === 0 ? (
        <EmptyState title="No Payment History" description="You have no recorded payments yet." />
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
                      {p.transactionRef || p.stripePaymentId || p.id.slice(0, 10)}
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      {p.booking?.bookingNumber || "—"}
                    </td>
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
        </div>
      )}
    </div>
  );
}
