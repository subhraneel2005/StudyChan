"use client";

import React, { useEffect } from "react";
import { Textarea } from "./textarea";
import { FiSend } from "react-icons/fi";
import { GoPaperclip } from "react-icons/go";

export default function AiInput() {
  const token = sessionStorage.getItem("token");

  return (
    <div className="relative max-w-xl mt-6 w-full">
      <Textarea
        placeholder="Ask me anything..."
        className="mt-6 w-full h-28 resize-none"
      />
      <GoPaperclip className="p-2 size-8 cursor-pointer absolute bottom-2 left-3 border border-neutral-800 rounded-lg bg-neutral-950 hover:bg-neutral-900 duration-300" />
      <FiSend className="p-2 size-8 cursor-pointer absolute bottom-2 right-3 border border-neutral-800 rounded-lg bg-neutral-950 hover:bg-neutral-900 duration-300" />
    </div>
  );
}
