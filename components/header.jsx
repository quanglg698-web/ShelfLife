"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-primary">
          ShelfLife
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {loading ? null : user ? (
            <>
              <span data-testid="user-email" className="max-w-[180px] truncate text-sm text-muted-foreground sm:max-w-none">
                {user.email}
              </span>
              <Link href="/books" data-testid="link-books" className="text-sm font-medium underline-offset-4 hover:underline">
                My Books
              </Link>
              <Button data-testid="btn-logout" variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login" data-testid="btn-login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register" data-testid="btn-register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
