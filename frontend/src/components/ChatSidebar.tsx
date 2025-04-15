"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

interface ChatData {
  id: string;
  documentId: string | null;
  document: {
    fileName: string;
  } | null;
  messages: Array<{
    content: string;
    role: string;
  }>;
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ChatSidebar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const url = `${backendURL}/allChats`;

  useEffect(() => {
    initializeAuth();
  }, []);

  console.log("TOKEN IN CHAT-SIDEBAR", token);
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    console.log("Token in fetchChats func: ", token);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error("Failed to fetch chats");
      }
      const allChats = response.data;
      setChats(allChats.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);

  const getChatTitle = (chat: ChatData) => {
    if (chat.document?.fileName) {
      return chat.document.fileName
        .replace(/^\d+-/, "")
        .replace(/\.[^/.]+$/, "");
    }

    const firstUserMessage = chat.messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.content.substring(0, 30) +
        (firstUserMessage.content.length > 30 ? "..." : "")
      );
    }

    return "New Chat";
  };

  const toggleSheet = () => setIsSheetOpen(!isSheetOpen);

  const sidebarContent = (
    <>
      <Sheet>
        <SheetHeader className="px-4">
          <SheetTitle>My Chats</SheetTitle>
          <SheetDescription>Your previous conversations</SheetDescription>
        </SheetHeader>
      </Sheet>

      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4">Loading chats...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : chats.length === 0 ? (
          <div className="text-center py-4">No chats found</div>
        ) : (
          chats?.map((chat) => (
            <Link href={`/chat/${chat.id}`}>
              <Button
                key={chat.id}
                className="w-full justify-start text-left h-auto py-3 overflow-hidden whitespace-normal"
                variant="ghost"
              >
                {getChatTitle(chat)}
              </Button>
            </Link>
          ))
        )}
        <Link href={"/chat"}>
          <Button variant={"outline"} className="w-full mt-6">
            New Chat
          </Button>
        </Link>
      </div>

      {isMobile && (
        <Sheet>
          <SheetFooter className="px-4 pb-4">
            <Button onClick={toggleSheet} className="w-full">
              Close
            </Button>
          </SheetFooter>
        </Sheet>
      )}
    </>
  );

  return (
    <>
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSheet}
          className="fixed top-4 left-4 z-50"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="left"
            className="w-80 p-0"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
    </>
  );
};

export default ChatSidebar;
