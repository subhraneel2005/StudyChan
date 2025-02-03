'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, Loader2, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FiPlus } from 'react-icons/fi';
import ChatSidebar from '@/components/ChatSidebar';

// Helper function to convert URLs to links
const convertLinksToJSX = (text) => {
  if (!text) return text;
  
  const urlPattern = /(https?:\/\/[^\s]+)|\[URL:\s*(https?:\/\/[^\]]+)\]/g;
  const parts = text.split(urlPattern);
  
  return parts.map((part, index) => {
    if (!part) return null;
    
    if (part.match(urlPattern) || part.startsWith('http')) {
      const cleanUrl = part.replace(/^\[URL:\s*|\]$/g, '');
      return (
        <a 
          key={index}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline inline-flex items-center gap-1"
        >
          {cleanUrl.length > 50 ? cleanUrl.substring(0, 50) + '...' : cleanUrl}
          <ExternalLink className="w-4 h-4" />
        </a>
      );
    }
    return part;
  });
};

const Message = ({ content, role }) => {
  return (
    <div className={`p-4 rounded-lg ${
      role === 'user' 
        ? 'bg-blue-500 text-white ml-auto' 
        : 'bg-gray-100 mr-auto'
    } max-w-[80%]`}>
      <div className="whitespace-pre-wrap break-words">
        {convertLinksToJSX(content)}
      </div>
    </div>
  );
};

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle scroll events
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/studychan/chat/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setMessages(data.chat.messages);
          
          if (data.chat.documentId) {
            setFileName(data.chat.documentId);
            setOriginalFileName(data.document?.originalName || '');
            setIsPdfUploaded(true);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsInitialLoading(false);
        scrollToBottom();
      }
    };
  
    fetchPreviousMessages();
  }, [chatId]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      await handleFileUpload(file);
    } else {
      setUploadStatus('Please upload a PDF file');
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadStatus('Uploading PDF...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/studychan/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFileName(data.savedDataToPostgres.fileName);
        setIsPdfUploaded(true);
        setUploadStatus('PDF uploaded successfully 🎉');
        alert(uploadStatus)
      } else {
        setUploadStatus(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isPdfUploaded) return;
  
    const tempId = `temp-${Date.now()}`;
    const newUserMessage = {
      content: inputMessage,
      role: 'user',
      id: tempId,
    };
  
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
  
    try {
      const response = await fetch(`http://localhost:3000/api/studychan/ask/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userQuery: inputMessage,
          fileName: fileName,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const newAiMessage = {
          id: Date.now(),
          content: data.aiResponse.answer,
          role: 'assistant',
        };
        setMessages(prev => [...prev, newAiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 max-w-4xl mx-auto">
      <ChatSidebar />
      <div className="flex-1 ml-64 max-w-4xl mx-auto p-4">
      {!isPdfUploaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 relative cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
          />
          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-lg text-blue-500">{uploadStatus}</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Click or drag and drop your PDF here to start chatting</p>
                {uploadStatus && (
                  <p className={`mt-2 ${uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                    {uploadStatus}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className='flex justify-center items-center gap-6 py-6 mb-20'>
          <Button>New Chat <FiPlus/></Button>
          <Button variant='destructive'>Delete this chat</Button>
          </div>
          <div 
            ref={messagesContainerRef}
            className="flex-1 flex flex-col space-y-4 overflow-y-auto relative"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Message content={message.content} role={message.role} />
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex space-x-2 p-4"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={scrollToBottom}
              className="fixed bottom-24 right-8 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      )}
      
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={!isPdfUploaded}
          placeholder={isPdfUploaded ? "Type your message..." : "Upload a PDF to start chatting"}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={!isPdfUploaded || !inputMessage.trim()}
          onClick={handleSendMessage}
          className={`p-2 rounded-lg ${
            isPdfUploaded && inputMessage.trim() 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-300'
          } text-white`}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
      </div>
    </div>
  );
}