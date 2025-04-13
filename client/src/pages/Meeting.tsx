import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, MoreVertical, MessageSquare, Users, Share2,
  Layout, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSharingScreen: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
}

const Meeting = () => {
  const { id: meetingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"chat" | "participants">("chat");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [layoutMode, setLayoutMode] = useState<"grid" | "spotlight">("grid");
  
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: user?.id || "current-user",
      name: user?.name || "You",
      avatar: user?.avatar,
      isSpeaking: false,
      isVideoOn: true,
      isAudioOn: true,
      isSharingScreen: false
    },
    {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
      isSpeaking: false,
      isVideoOn: true,
      isAudioOn: true,
      isSharingScreen: false
    },
    {
      id: "user2",
      name: "Michael Chen",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
      isSpeaking: true,
      isVideoOn: true,
      isAudioOn: true,
      isSharingScreen: false
    },
    {
      id: "user3",
      name: "Jessica Williams",
      avatar: "https://ui-avatars.com/api/?name=Jessica+Williams&background=random",
      isSpeaking: false,
      isVideoOn: false,
      isAudioOn: false,
      isSharingScreen: false
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prev => 
        prev.map(p => ({
          ...p,
          isSpeaking: Math.random() > 0.7
        }))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    setIsAudioOn(prev => !prev);
    toast(isAudioOn ? "Microphone turned off" : "Microphone turned on");
  };

  const toggleVideo = () => {
    setIsVideoOn(prev => !prev);
    toast(isVideoOn ? "Camera turned off" : "Camera turned on");
  };

  const toggleScreenShare = () => {
    setIsSharingScreen(prev => !prev);
    toast(isSharingScreen ? "Screen sharing stopped" : "Screen sharing started");
  };

  const endCall = () => {
    toast("Meeting ended");
    navigate("/dashboard");
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: user?.id || "current-user",
      senderName: user?.name || "You",
      senderAvatar: user?.avatar,
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meetingId}`);
    toast("Meeting link copied to clipboard");
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="bg-black/80 p-4 flex justify-between items-center text-white border-b border-gray-800">
        <div className="flex items-center gap-2">
          <VideoIcon className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">{meetingId}</h1>
        </div>
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white"
            onClick={copyMeetingLink}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex-grow flex relative">
        <div className="flex-grow p-4">
          <div className={`grid gap-4 h-full ${
            layoutMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 auto-rows-fr" 
              : "grid-cols-1"
          }`}>
            {participants.map((participant, index) => (
              <div 
                key={participant.id} 
                className={`video-container relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center ${
                  participant.isSpeaking ? "speaking" : ""
                } ${layoutMode === "spotlight" && index !== 0 ? "md:hidden" : ""}`}
              >
                {participant.isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded-md text-sm flex items-center">
                  {participant.name}
                  {!participant.isAudioOn && <MicOff className="h-3 w-3 ml-2" />}
                  {participant.isSharingScreen && <Share2 className="h-3 w-3 ml-2" />}
                </div>
                
                {participant.isSpeaking && (
                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent className="w-[320px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Meeting Details</SheetTitle>
            </SheetHeader>
            
            <Tabs 
              defaultValue={activeSidebarTab} 
              onValueChange={(value) => setActiveSidebarTab(value as "chat" | "participants")}
              className="mt-4"
            >
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="participants" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Participants ({participants.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                <div className="flex flex-col h-[calc(100vh-200px)]">
                  <div className="flex-grow overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Be the first to send a message!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>
                                {message.senderName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {message.senderId === (user?.id || "current-user") 
                                    ? "You" 
                                    : message.senderName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm">{message.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={!messageText.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="participants" className="mt-4">
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 relative">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          {participant.isSpeaking && (
                            <span className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></span>
                          )}
                        </Avatar>
                        <span>
                          {participant.id === (user?.id || "current-user") ? `${participant.name} (You)` : participant.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!participant.isAudioOn && <MicOff className="h-4 w-4 text-muted-foreground" />}
                        {!participant.isVideoOn && <VideoOff className="h-4 w-4 text-muted-foreground" />}
                        {participant.isSharingScreen && <Share2 className="h-4 w-4 text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="meeting-controls bg-black p-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleAudio}
            className={`control-button ${isAudioOn ? 'secondary' : 'muted'}`}
            variant="ghost"
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            onClick={toggleVideo}
            className={`control-button ${isVideoOn ? 'secondary' : 'muted'}`}
            variant="ghost"
          >
            {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            onClick={toggleScreenShare}
            className={`control-button ${isSharingScreen ? 'primary' : 'secondary'}`}
            variant="ghost"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={endCall} 
            className="control-button danger bg-destructive text-white hover:bg-destructive/90"
            variant="ghost"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className="control-button secondary"
            variant="ghost"
          >
            {activeSidebarTab === "chat" ? (
              <MessageSquare className="h-5 w-5" />
            ) : (
              <Users className="h-5 w-5" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="control-button secondary"
                variant="ghost"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLayoutMode(layoutMode === "grid" ? "spotlight" : "grid")}>
                <Layout className="h-4 w-4 mr-2" />
                {layoutMode === "grid" ? "Switch to Spotlight" : "Switch to Grid"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
