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
import { Checkbox } from "@/components/ui/checkbox";

function Login() {
  return (
    <div className="min-h-screen bg-red-50">
      <section className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-3xl shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">
              Welcome Back!
            </CardTitle>

            <CardDescription>
              Sign in to your Leave Management account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" />

                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-normal"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              You agree to the terms and conditions of LMGMS.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Login;