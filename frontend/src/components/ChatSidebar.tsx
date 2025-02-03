import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Document = {
    fileName: string;
    id: string;
    userId: string;
  };

  
interface Chat{
    id: string
    document: Document
}

export default function ChatSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/studychan/allChats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setChats(data.data || []);
        } else {
          console.error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <motion.div 
      className={`fixed left-0 top-0 bottom-0 bg-white shadow-lg z-50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } border-r`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      <div className="flex flex-col h-full">
        {/* Collapse/Expand Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-100 rounded-full"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {/* Chats List */}
        <div className="mt-16 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No chats found</div>
          ) : (
            chats.map((chat: Chat) => (
              <div 
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer group"
              >
                <FileText className="mr-3 text-gray-500 group-hover:text-blue-500" />
                {!isCollapsed && (
                  <div className="flex-1 truncate">
                    {chat.document?.fileName || 'Unnamed Chat'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}