"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./textarea";
import { FiSend } from "react-icons/fi";
import { GoPaperclip } from "react-icons/go";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Button } from "./button";
import { uploadFile } from "@/helpers/uploadHelper/upload";
import { useUploadStore } from "@/stores/uploadStore";
import { createNewChat } from "@/helpers/chatHelper/createNewChat";
import { UserQuery } from "@/helpers/chatHelper/userQuery";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chatStore";

export default function AiInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const isUploaded = useUploadStore((state) => state.isUploaded);
  const setIsUploaded = useUploadStore((state) => state.setIsUploaded);
  const fileName = useUploadStore((state) => state.filename);
  const setFilename = useUploadStore((state) => state.setFilename);
  const setChatID = useChatStore((state) => state.setChatID);
  const setFirstQuestion = useChatStore((state) => state.setFirstQuestion);
  const setDocName = useChatStore((state) => state.setDocName);
  const setAiResponse = useChatStore((state) => state.setAiResponse);

  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [IsSending, setIsSending] = useState(false);

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
      toast.success("Upload successfull🎉");
      setFilename(result.savedDataToPostgres?.fileName);
      setIsUploaded(true);
    } catch (error) {
      console.log("Error in AI-Input component while uploading pdf:", error);
      toast.error("Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  const startChatHandler = async () => {
    if (!isUploaded) {
      toast.warning("Upload a pdf file first");
      return;
    }
    try {
      setIsSending(true);
      if (!token) {
        toast.error("Token missing");
        return;
      }
      console.log("TOKEN", token);

      const data = await createNewChat({ token });
      const chatId = data.chatId;
      console.log("Chat ID: ", chatId);

      if (chatId) {
        const res = await UserQuery({
          chatId,
          fileName,
          token,
          userQuery,
        });
        toast.success("New chat created successfully🎉");
        setChatID(chatId);
        setFirstQuestion(userQuery);
        setDocName(fileName);
        setAiResponse(res?.aiResponse?.answer);
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.log("Error creating new chat", error);
      toast.error("Error creating new chat");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative max-w-xl mt-6 w-full">
      <Textarea
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
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
        disabled={loading || isUploaded}
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-3 left-3"
      >
        {loading ? (
          <div className="p-2 size-4 animate-spin rounded-full border-2 border-neutral-800 border-t-white" />
        ) : (
          `${isUploaded ? "Already Uploaded" : "Upload"}`
        )}
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={startChatHandler}
              disabled={IsSending}
              className="cursor-pointer absolute bottom-3 right-3"
            >
              {IsSending ? "Sending..." : "Send"}
            </Button>
          </TooltipTrigger>
          {!isUploaded && (
            <TooltipContent>
              <p>Upload a PDF to start chatting</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
