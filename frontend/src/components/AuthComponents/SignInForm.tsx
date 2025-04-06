"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { signin } from "@/helpers/authHelpers/signin";

export default function SigninForm() {
  const searchParams = useSearchParams();

  const username0 = searchParams.get("username");
  const password0 = searchParams.get("password");

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(username0 || "");
  const [password, setPassword] = useState(password0 || "");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!username || !password) {
        toast.error("Please fill all fields");
        return;
      }
      const response = await signin({ username, password });

      toast.success(response.message);
      setUsername("");
      setPassword("");
      sessionStorage.setItem("token", response.token);
      router.push(`/chat`);
    } catch (error) {
      console.log("Error in signin form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full md:max-w-[450px] px-2 max-w-xs mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Login to your account
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={"/signup"} className="text-blue-500 hover:underline">
            Signup
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <Button disabled={loading} onClick={handleSubmit} className="w-full">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <p>Logging in...</p>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            </div>
          ) : (
            "Log in"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
