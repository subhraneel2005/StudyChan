"use client";

import { useChatStore } from "@/stores/chatStore";
import { useParams } from "next/navigation";
import React from "react";

export default function page() {
  const params = useParams();
  const { id } = params;

  const docName = useChatStore((state) => state.docName);
  const firstQuestion = useChatStore((state) => state.firstQuestion);
  const aiResponse = useChatStore((state) => state.aiResponse);

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat Details</h1>
        <div className="mb-2">
          <span className="font-semibold">Chat ID:</span> {id}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Document Name:</span> {docName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">First Question:</span> {firstQuestion}
        </div>
        <div className="mb-2">
          <span className="font-semibold">AI Response:</span> {aiResponse}
        </div>
      </div>
    </div>
  );
}
