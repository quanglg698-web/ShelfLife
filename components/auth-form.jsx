"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { validateAuth } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false); // nothing is shown before the first submit
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  // Errors are recomputed on every render, so each one disappears as soon as its field is valid.
  const errors = submitted ? validateAuth(values, isRegister) : {};

  const onChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    setSuccess(false);
    if (Object.keys(validateAuth(values, isRegister)).length > 0) return;

    setBusy(true);
    const email = values.email.trim();
    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({ email, password: values.password });
      if (error) setAuthError(error.message);
      else if (data.user && data.user.identities && data.user.identities.length === 0)
        setAuthError("User already registered");
      else setSuccess(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: values.password });
      if (error) setAuthError(error.message);
      else router.push("/books");
    }
    setBusy(false);
  }

  const p = isRegister ? "register" : "login";

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{isRegister ? "Create an account" : "Log in"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form data-testid={`${p}-form`} noValidate onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${p}-email`}>Email</Label>
            <Input id={`${p}-email`} data-testid={`${p}-email`} type="email" autoComplete="email"
              value={values.email} onChange={onChange("email")} />
            {errors.email && <p data-testid="error-email" className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${p}-password`}>Password</Label>
            <Input id={`${p}-password`} data-testid={`${p}-password`} type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={values.password} onChange={onChange("password")} />
            {errors.password && <p data-testid="error-password" className="text-sm text-destructive">{errors.password}</p>}
          </div>
          {isRegister && (
            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">Confirm password</Label>
              <Input id="register-confirm-password" data-testid="register-confirm-password" type="password"
                autoComplete="new-password" value={values.confirm} onChange={onChange("confirm")} />
              {errors.confirm && (
                <p data-testid="error-confirm-password" className="text-sm text-destructive">{errors.confirm}</p>
              )}
            </div>
          )}
          {authError && <p data-testid="error-auth" className="text-sm text-destructive">{authError}</p>}
          {isRegister && success && (
            <p data-testid="form-success" className="text-sm font-medium text-green-700">Registration successful</p>
          )}
          <Button data-testid={`${p}-submit`} type="submit" className="w-full" disabled={busy}>
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
