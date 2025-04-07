"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./textarea";
import { FiSend } from "react-icons/fi";
import { GoPaperclip } from "react-icons/go";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Button } from "./button";
import { uploadFile } from "@/helpers/uploadHelper/upload";

export default function AiInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(false);

  const uploadPdfHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a PDF file before submiting");
      return;
    }
    if (!token) {
      toast.error("No Auth token found! Please Login again");
      return;
    }
    try {
      setLoading(true);
      const result = await uploadFile({ file, token });
      console.log("Upload Successfull", result);
      toast.success(result.message);
    } catch (error) {
      console.log("Error in AI-Input component while uploading pdf:", error);
      toast.error("Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-xl mt-6 w-full">
      <Textarea
        placeholder="Ask me anything..."
        className="mt-6 w-full h-36 resize-none"
      />

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={uploadPdfHandler}
        className="hidden"
      />

      <Button
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-3 left-3"
      >
        {loading ? (
          <div className="p-2 size-4 animate-spin rounded-full border-2 border-neutral-800 border-t-white" />
        ) : (
          "Upload"
        )}
      </Button>

      <FiSend className="p-2 size-8 cursor-pointer absolute bottom-3 right-3 border border-neutral-800 rounded-lg bg-neutral-950 hover:bg-neutral-900 duration-300" />
    </div>
  );
}
