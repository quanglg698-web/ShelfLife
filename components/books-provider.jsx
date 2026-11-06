"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { STATUSES } from "@/lib/validation";

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  // Books are stored together with the id of their owner, so another person's
  // books can never be shown, not even for one render after a user switch.
  const [store, setStore] = useState({ ownerId: null, items: [], loaded: false });
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setStore({ ownerId: userId, items: [], loaded: false });
    setStatusFilter("");
    setSearch("");
    setLoadError("");
    if (!userId) return;
    let cancelled = false;
    supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setLoadError(error.message);
        setStore({ ownerId: userId, items: error ? [] : data, loaded: true });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const mine = store.ownerId === userId;
  const books = mine ? store.items : [];
  const loaded = mine && store.loaded;

  const addBook = useCallback(async ({ title, author, pages, status }) => {
    const { data, error } = await supabase
      .from("books")
      .insert({ title, author, pages, status }) // user_id is filled by the database (auth.uid())
      .select()
      .single();
    if (error) return { error: error.message };
    setStore((s) => ({ ...s, items: [data, ...s.items] }));
    return { error: null };
  }, []);

  const changeStatus = useCallback(async (id, status) => {
    const { data, error } = await supabase.from("books").update({ status }).eq("id", id).select().single();
    if (error) return { error: error.message };
    setStore((s) => ({ ...s, items: s.items.map((b) => (b.id === id ? data : b)) }));
    return { error: null };
  }, []);

  const deleteBook = useCallback(async (id) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) return { error: error.message };
    setStore((s) => ({ ...s, items: s.items.filter((b) => b.id !== id) }));
    return { error: null };
  }, []);

  const clearFilters = () => {
    setStatusFilter("");
    setSearch("");
  };

  // Everything below is derived from the same shared list.
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter(
      (b) =>
        (!statusFilter || b.status === statusFilter) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );
  }, [books, statusFilter, search]);

  const summary = useMemo(() => {
    const counts = new Map();
    let totalPages = 0;
    for (const b of visible) {
      totalPages += b.pages;
      counts.set(b.status, (counts.get(b.status) ?? 0) + 1);
    }
    const breakdown = [...counts.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count || STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status));
    return { count: visible.length, totalPages, breakdown };
  }, [visible]);

  const value = {
    books, visible, summary, loaded, loadError,
    statusFilter, setStatusFilter, search, setSearch, clearFilters,
    addBook, changeStatus, deleteBook,
  };
  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used inside BooksProvider");
  return ctx;
}
