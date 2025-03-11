import ChatSidebar from "@/components/ChatSidebar";

export default function ChatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-full flex justify-center items-center">
        <ChatSidebar/>
        {children}
      </div>
    );
  }