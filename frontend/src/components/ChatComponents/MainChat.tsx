"use client";

import AiInput from "@/components/ui/ai-input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import React, { useEffect } from "react";

export default function MainChat() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    console.log("MAIN CHAT");

    if (typeof window !== "undefined") {
      initializeAuth();
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full justify-center items-center flex flex-col tracking-tighter px-3">
        <h1 className="font-bold text-4xl md:text-5xl text-center">
          You need to sign in first
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Please sign in to access the chat
        </p>

        <Link href={"/signin"}>
          <Button
            variant={"outline"}
            className="mt-4 text-blue-500 hover:underline cursor-pointer"
          >
            Signin
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full justify-center items-center flex flex-col px-3">
      <h1 className="font-bold text-4xl md:text-5xl">
        Hi I'm <i className="font-black">StudyChan</i>
      </h1>
      <p className="text-lg text-muted-foreground mt-2">
        What do you want to learn today?
      </p>

      <AiInput />
    </div>
  );
}
