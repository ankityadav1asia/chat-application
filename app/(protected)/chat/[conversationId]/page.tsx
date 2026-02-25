"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function IndividualChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar - hidden on mobile by default */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-80 border-r`}>
        <Sidebar onSelectConversation={() => {}} />
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Back Button */}
        <div className="md:hidden border-b p-2 flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/chat')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium">Back to Chats</span>
        </div>
        
        <ChatArea conversationId={conversationId} />
      </div>
    </div>
  );
}