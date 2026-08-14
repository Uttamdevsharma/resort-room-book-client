"use client";

import { useState, useEffect } from "react";
import { refundsApi, RefundRecord } from "@/lib/api/refunds";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { RefundsSkeleton } from "@/components/dashboard/skeletons";
import { Plus, Search, RefreshCw, CreditCard } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export function RefundsAdminContent() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRefunds = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await refundsApi.listRefundsAdmin({
        page: currentPage,
        limit: 10,
        status: status || undefined,
      });
      if (res.data) setRefunds(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error("Error loading refunds:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds(page);
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRefunds(1);
  };

  const handleOpenCreate = () => {
    setPaymentId("");
    setAmount("");
    setReason("");
    setModalOpen(true);
  };

  const handleCreateRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId) return;
    setSubmitting(true);
    try {
      await refundsApi.createRefund({
        paymentId,
        amount: amount ? Number(amount) : undefined,
        reason: reason || undefined,
      });
      setModalOpen(false);
      fetchRefunds(page);
    } catch (err: any) {
      alert(err.message || "Failed to create refund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Refunds Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Process and track refund requests for guest bookings</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Process Refund
        </Button>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="p-4 bg-card border border-border rounded-2xl flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by payment ID or booking ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SUCCEEDED">SUCCEEDED</option>
          <option value="FAILED">FAILED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <Button type="submit" variant="primary">
          Filter
        </Button>
      </form>

      {isLoading ? (
        <RefundsSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Refund ID</th>
                  <th className="p-4">Payment Ref</th>
                  <th className="p-4">Booking #</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-foreground">{r.id.slice(0, 8)}...</td>
                    <td className="p-4 font-semibold text-primary">
                      {r.stripeRefundId || r.paymentId.slice(0, 10)}
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {r.bookingId}
                    </td>
                    <td className="p-4 font-extrabold text-foreground">${r.amount} {r.currency}</td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">{r.reason || "&mdash;"}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
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

      {/* Create Refund Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Process New Refund">
        <form onSubmit={handleCreateRefund} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Payment ID / Transaction Ref</label>
            <input
              type="text"
              required
              placeholder="Enter payment ID or Stripe session ID"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Refund Amount (Optional)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Leave blank for full refund"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Reason</label>
            <textarea
              rows={2}
              placeholder="Guest cancelled, duplicate charge, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Processing..." : "Create Refund"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}