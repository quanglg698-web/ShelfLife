import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { BooksProvider } from "@/components/books-provider";
import Header from "@/components/header";

export const metadata = {
  title: "ShelfLife",
  description: "Keep track of the books you want to read, are reading or have finished.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <BooksProvider>
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          </BooksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
