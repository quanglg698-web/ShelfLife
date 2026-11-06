"use client";
import { useBooks } from "@/components/books-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Summary() {
  const { summary } = useBooks();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>Books: <strong data-testid="book-count">{summary.count}</strong></p>
        <p>Total pages: <strong data-testid="total-pages">{summary.totalPages}</strong></p>
        <div data-testid="status-breakdown" className="space-y-1">
          {summary.breakdown.map((r) => (
            <div key={r.status} data-testid="breakdown-row" className="flex justify-between border-b py-1 last:border-0">
              <span data-testid="breakdown-name">{r.status}</span>
              <span data-testid="breakdown-count">{r.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
