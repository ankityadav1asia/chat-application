"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar onSelectConversation={setSelectedConversation} />
      <div className="flex-1">
        {selectedConversation ? (
          <ChatArea conversationId={selectedConversation} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">Welcome to Chat</h2>
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}