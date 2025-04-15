import React from "react";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "./CopyButton";

interface MessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    isLoading?: boolean;
  };
}

export const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${
        isUser ? "items-end" : "items-start"
      } max-w-[80%]`}
    >
      <div
        className={`w-full p-3 rounded-lg whitespace-pre-wrap break-words ${
          isUser
            ? "rounded-br-none bg-zinc-900 text-white"
            : "rounded-bl-none bg-zinc-900 text-white"
        } ${message.isLoading ? "animate-pulse" : ""}`}
      >
        {isUser ? (
          <div>{message.content}</div>
        ) : (
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              p: ({ node, ...props }) => <p {...props} className="mb-2" />,
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-5 mb-2" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-5 mb-2" />
              ),
              li: ({ node, ...props }) => <li {...props} className="mb-1" />,
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-xl font-bold mb-2" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-lg font-bold mb-2" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-md font-bold mb-2" />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code
                    {...props}
                    className="bg-zinc-800 rounded px-1 py-0.5"
                  />
                ) : (
                  <code
                    {...props}
                    className="block bg-zinc-800 rounded p-2 overflow-x-auto my-2"
                  />
                ),
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="bg-zinc-800 rounded p-2 overflow-x-auto my-2"
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {/* Copy button below the message */}
      <div className="mt-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <CopyButton text={message.content} />
      </div>
    </div>
  );
};
