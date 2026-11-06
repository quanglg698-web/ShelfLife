import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { title: "Add books", text: "Save every book with its author, number of pages and reading status." },
  { title: "Track your progress", text: "Move a book from To Read to Reading to Finished with one click." },
  { title: "Search your shelf", text: "Filter by status or search by title or author, and see totals at a glance." },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="py-8 text-center">
        <h1 data-testid="home-title" className="text-4xl font-bold tracking-tight">ShelfLife</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Your personal reading list. Keep the books you want to read, are reading or have finished in one
          place and see how much is on your shelf.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.text}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
