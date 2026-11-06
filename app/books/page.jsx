"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import BookForm from "@/components/book-form";
import BookList from "@/components/book-list";
import Summary from "@/components/summary";

export default function BooksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Nothing is shown while we find out who is logged in, nor for a visitor (who is redirected).
  if (loading || !user) return null;

  return (
    <div data-testid="books-page" className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-1">
        <BookForm />
        <Summary />
      </div>
      <div className="lg:col-span-2">
        <BookList />
      </div>
    </div>
  );
}
