"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { signup } from "@/helpers/authHelpers/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!username || !email || !password) {
        toast.error("Please fill all fields");
        return;
      }
      await signup({ username, email, password });

      toast.success("Account created successfully");
      setUsername("");
      setEmail("");
      setPassword("");
      router.push(`/signin?username=${username}&password=${password}`);
    } catch (error) {
      console.log("Error in signup form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full md:max-w-[450px] px-2 max-w-xs mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">Create an Account</CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={"/signin"} className="text-blue-500 hover:underline">
            Login
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            placeholder="Enter username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="Enter email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-2.5"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <p>Creating...</p>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
