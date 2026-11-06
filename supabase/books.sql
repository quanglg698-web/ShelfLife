-- ShelfLife: run this in the Supabase SQL Editor.

create table if not exists public.books (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title      text not null,
  author     text not null,
  pages      integer not null,
  status     text not null default 'To Read',
  created_at timestamptz not null default now(),

  -- The database refuses bad data, not only the forms.
  constraint books_title_chk  check (title  ~ '\S' and char_length(title)  <= 80),
  constraint books_author_chk check (author ~ '\S' and char_length(author) <= 60),
  constraint books_pages_chk  check (pages between 1 and 5000),
  constraint books_status_chk check (status in ('To Read', 'Reading', 'Finished'))
);

create index if not exists books_user_created_idx on public.books (user_id, created_at desc);

-- Privileges: nothing for visitors; only the actions the app needs for logged-in users.
revoke all on public.books from anon, authenticated;
grant select, insert, delete on public.books to authenticated;
grant update (status) on public.books to authenticated;   -- the app only changes the status

-- Row Level Security: each person sees and changes only their own rows.
alter table public.books enable row level security;

create policy "books_select_own" on public.books
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "books_insert_own" on public.books
  for insert to authenticated
  with check ((select auth.uid()) = user_id);   -- a row with another person's user_id is rejected

create policy "books_update_own" on public.books
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "books_delete_own" on public.books
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- No policy exists for the anon role, so a logged-out visitor can neither read nor write.
