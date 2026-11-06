"use client";
import { useState } from "react";
import { useBooks } from "@/components/books-provider";
import { STATUSES } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function BookList() {
  const {
    visible, loaded, loadError, statusFilter, setStatusFilter, search, setSearch, clearFilters,
    changeStatus, deleteBook,
  } = useBooks();
  const [actionError, setActionError] = useState("");

  async function run(promise) {
    setActionError("");
    const { error } = await promise;
    if (error) setActionError(error);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select data-testid="filter-status" aria-label="Filter by status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Input data-testid="search-input" aria-label="Search" placeholder="Search title or author"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button data-testid="btn-clear-filters" type="button" variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {(loadError || actionError) && <p data-testid="error-book" className="text-sm text-destructive">{loadError || actionError}</p>}

      {loaded && visible.length === 0 ? (
        <p data-testid="books-empty" className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
          No books found
        </p>
      ) : (
        <ul data-testid="book-list" className="space-y-3">
          {visible.map((b) => (
            <li key={b.id} data-testid="book-item">
              <Card>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p data-testid="book-title" className="break-words font-semibold">{b.title}</p>
                    <p data-testid="book-author" className="break-words text-sm text-muted-foreground">{b.author}</p>
                    <p className="mt-1 text-sm">
                      <span data-testid="book-pages">{b.pages} pages</span>
                      {" · "}
                      <span data-testid="book-status" className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                        {b.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {b.status !== "Finished" && (
                      <Button data-testid="btn-advance-status" size="sm" variant="secondary"
                        onClick={() => run(changeStatus(b.id, STATUSES[STATUSES.indexOf(b.status) + 1]))}>
                        Advance status
                      </Button>
                    )}
                    <Button data-testid="btn-delete-book" size="sm" variant="destructive"
                      onClick={() => run(deleteBook(b.id))}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
