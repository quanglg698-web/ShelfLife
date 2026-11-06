export const STATUSES = ["To Read", "Reading", "Finished"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuth({ email, password, confirm }, isRegister) {
  const e = {};
  const mail = (email ?? "").trim();
  if (!mail) e.email = "Email is required";
  else if (!EMAIL_RE.test(mail)) e.email = "Please enter a valid email address";

  if (!password) e.password = "Password is required";
  else if (isRegister && password.length < 6) e.password = "Password must be at least 6 characters";

  if (isRegister) {
    if (!confirm) e.confirm = "Confirm password is required";
    else if (confirm !== password) e.confirm = "Passwords do not match";
  }
  return e;
}

export function validateBook({ title, author, pages, status }) {
  const e = {};
  const t = (title ?? "").trim();
  const a = (author ?? "").trim();
  const p = (pages ?? "").trim();

  if (!t) e.title = "Title is required";
  else if (t.length > 80) e.title = "Title must be at most 80 characters";

  if (!a) e.author = "Author is required";
  else if (a.length > 60) e.author = "Author must be at most 60 characters";

  if (!p) e.pages = "Pages is required";
  else if (!/^\d+$/.test(p) || Number(p) < 1 || Number(p) > 5000)
    e.pages = "Pages must be a whole number between 1 and 5000";

  if (!STATUSES.includes(status)) e.status = "Please choose a status";
  return e;
}
