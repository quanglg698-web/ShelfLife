"use client";
import { useState } from "react";
import { useBooks } from "@/components/books-provider";
import { STATUSES, validateBook } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const EMPTY = { title: "", author: "", pages: "", status: "" };

export default function BookForm() {
  const { addBook } = useBooks();
  const [values, setValues] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const errors = submitted ? validateBook(values) : {};
  const onChange = (f) => (e) => setValues((v) => ({ ...v, [f]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    setSuccess(false);
    if (Object.keys(validateBook(values)).length > 0) return;

    setBusy(true);
    const { error } = await addBook({
      title: values.title.trim(),
      author: values.author.trim(),
      pages: Number(values.pages.trim()),
      status: values.status,
    });
    setBusy(false);
    if (error) {
      setServerError(error);
      return;
    }
    setValues(EMPTY);
    setSubmitted(false);
    setSuccess(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a book</CardTitle>
      </CardHeader>
      <CardContent>
        <form data-testid="book-form" noValidate onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="input-title">Title</Label>
            <Input id="input-title" data-testid="input-title" value={values.title} onChange={onChange("title")} />
            {errors.title && <p data-testid="error-title" className="text-sm text-destructive">{errors.title}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="input-author">Author</Label>
            <Input id="input-author" data-testid="input-author" value={values.author} onChange={onChange("author")} />
            {errors.author && <p data-testid="error-author" className="text-sm text-destructive">{errors.author}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="input-pages">Pages</Label>
            <Input id="input-pages" data-testid="input-pages" type="text" inputMode="numeric"
              value={values.pages} onChange={onChange("pages")} />
            {errors.pages && <p data-testid="error-pages" className="text-sm text-destructive">{errors.pages}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="select-status">Status</Label>
            <Select id="select-status" data-testid="select-status" value={values.status} onChange={onChange("status")}>
              <option value="">Choose status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            {errors.status && <p data-testid="error-status" className="text-sm text-destructive">{errors.status}</p>}
          </div>
          {serverError && <p data-testid="error-book" className="text-sm text-destructive">{serverError}</p>}
          {success && <p data-testid="book-success" className="text-sm font-medium text-green-700">Book added</p>}
          <Button data-testid="btn-add-book" type="submit" className="w-full" disabled={busy}>
            Add book
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
