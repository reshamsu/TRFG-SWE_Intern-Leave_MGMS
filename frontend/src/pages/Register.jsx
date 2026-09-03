import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Field } from "@/components/ui/field";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registeration Failed");
      }

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-red-50">
      <section className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-3xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">
              Welcome to Leave MGMS
            </CardTitle>

            <CardDescription>
              Register your new Leave Management account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleRegister}>
              {error && (
                <p className="text-sm text-center text-red-600 px-4 py-2 bg-red-100 border border-red-200 rounded-lg">
                  {error}
                </p>
              )}

              <Field>
                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Your Name"
                  autoComplete="name"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full primary"
              >
                {isLoading ? "Registering..." : "Sign Up"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              You agree to the terms and conditions of LMGMS.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
