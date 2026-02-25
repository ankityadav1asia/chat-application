"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { ConversationList } from "./ConversationList";
import { UserList } from "./UserList";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SidebarProps {
  onSelectConversation: (conversationId: string) => void;
}

export function Sidebar({ onSelectConversation }: SidebarProps) {
  const [view, setView] = useState<"chats" | "users">("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  
  // Get Convex user ID from Clerk user
  const convexUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  if (!convexUser) {
    return (
      <div className="w-80 border-r bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          <Button
            variant={view === "chats" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("chats")}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chats
          </Button>
          <Button
            variant={view === "users" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("users")}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </Button>
        </div>
        <SearchBar onSearch={setSearchTerm} placeholder={`Search ${view}...`} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === "chats" ? (
          <ConversationList 
            userId={convexUser._id} 
            searchTerm={searchTerm}
            onSelectConversation={onSelectConversation}
          />
        ) : (
          <UserList 
            currentUserId={convexUser._id}
            searchTerm={searchTerm}
            onStartConversation={onSelectConversation}
          />
        )}
      </div>
    </div>
  );
}