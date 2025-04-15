"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserQuery } from "@/helpers/chatHelper/userQuery";
import { toast } from "sonner";
import { MessageBubble } from "@/components/ChatComponents/MessageBubble";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface ChatResponse {
  chat: {
    id: string;
    userId: string;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
  };
  document: {
    fileName: string;
    originalName: string;
  };
}

interface LoadingMessage {
  id: string;
  content: string;
  role: "assistant";
  createdAt: string;
  isLoading?: boolean;
}

type DisplayMessage = Message | LoadingMessage;

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch chat messages on component mount
  useEffect(() => {
    const fetchChatMessages = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/chat/${chatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chat messages");
        }

        const data: ChatResponse = await response.json();
        setMessages(data.chat.messages || []);

        if (data.document) {
          setFileName(data.document.fileName);
          setOriginalName(data.document.originalName);
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        setError("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId, backendURL, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: DisplayMessage = {
      id: Date.now().toString(),
      chatId,
      content: userInput,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const currentUserInput = userInput;
    setUserInput("");

    inputRef.current?.focus();

    try {
      if (!token) {
        toast.error("Token missing!");
        return;
      }
      setLoading(true);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: "loading",
          content: "...",
          role: "assistant",
          createdAt: new Date().toISOString(),
          isLoading: true,
        },
      ]);

      // Call API to get AI response
      const res = await UserQuery({
        chatId,
        fileName,
        token,
        userQuery: currentUserInput,
      });

      // Remove loading indicator and add AI response
      setMessages((prevMessages) =>
        prevMessages
          .filter((msg) => msg.id !== "loading")
          .concat({
            id: Date.now().toString() + "-response",
            chatId,
            content:
              res?.aiResponse?.answer ||
              "Sorry, I couldn't process that request.",
            role: "assistant",
            createdAt: new Date().toISOString(),
          })
      );
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prevMessages) =>
        prevMessages
          .filter((msg) => msg.id !== "loading")
          .concat({
            id: Date.now().toString() + "-error",
            chatId,
            content:
              "Sorry, there was an error processing your message. Please try again.",
            role: "assistant",
            createdAt: new Date().toISOString(),
          })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 md:max-w-4xl">
      <div className="p-4  flex items-center justify-between">
        <h1 className="text-2xl font-semibold">StudyChan</h1>
        {originalName && (
          <div className="text-sm opacity-75">Document: {originalName}</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error ? (
          <div className="text-center py-8">{error}</div>
        ) : loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse">Loading conversation...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full opacity-75">
            Start a conversation with StudyChan
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <MessageBubble message={message} />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex items-center space-x-2">
        <Input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading && messages.some((m) => m.id === "loading")}
        />
        <Button
          type="submit"
          disabled={
            !userInput.trim() ||
            (loading && messages.some((m) => m.id === "loading"))
          }
        >
          Send
        </Button>
      </form>
    </div>
  );
}
