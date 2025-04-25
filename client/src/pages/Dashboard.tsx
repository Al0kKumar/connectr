
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarClock, Clock, Video, Plus, Users, ArrowRight, VideoOff } from "lucide-react";

interface MeetingCardProps {
  id: string;
  name: string;
  time: string;
  participants: number;
  status: 'upcoming' | 'completed' | 'ongoing';
  onClick?: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ 
  id, 
  name, 
  time, 
  participants, 
  status,
  onClick 
}) => {
  const navigate = useNavigate();
  
  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/meeting/${id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick || (() => navigate(`/meeting/${id}`))}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="flex items-center text-muted-foreground mt-2">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{time}</span>
            </div>
            <div className="flex items-center text-muted-foreground mt-1">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{participants} participants</span>
            </div>
          </div>
          <div>
            {status === 'ongoing' ? (
              <div className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <Button size="sm" onClick={handleJoin}>Join Now</Button>
              </div>
            ) : status === 'upcoming' ? (
              <div className="flex items-center">
                <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                <Button variant="outline" size="sm" onClick={handleJoin}>Start</Button>
              </div>
            ) : (
              <div className="flex items-center">
                <VideoOff className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-xs text-muted-foreground">Ended</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
  const [joinMeetingDialogOpen, setJoinMeetingDialogOpen] = useState(false);
  const [meetingCode, setMeetingCode] = useState("");

  const mockMeetings: MeetingCardProps[] = [
    {
      id: "meet-1234",
      name: "Weekly Team Standup",
      time: "Today, 9:00 AM",
      participants: 8,
      status: 'ongoing',
    },
    {
      id: "meet-5678",
      name: "Product Demo",
      time: "Tomorrow, 2:00 PM",
      participants: 12,
      status: 'upcoming',
    },
    {
      id: "meet-9012",
      name: "Client Presentation",
      time: "Today, 8:00 AM",
      participants: 5,
      status: 'completed',
    },
  ];

  const handleNewMeeting = () => {
    const meetingId = `meet-${Math.random().toString(36).substring(2, 9)}`;
    navigate(`/meeting/${meetingId}`);
  };

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      navigate(`/meeting/${meetingCode}`);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your meetings and connect with others</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setNewMeetingDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </Button>
            <Button variant="outline" onClick={() => setJoinMeetingDialogOpen(true)}>
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="mt-8">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMeetings
                .filter(meeting => meeting.status !== 'completed')
                .map(meeting => (
                  <MeetingCard key={meeting.id} {...meeting} />
                ))}
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
                onClick={() => setNewMeetingDialogOpen(true)}
              >
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Schedule a meeting</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMeetings
                .filter(meeting => meeting.status === 'completed')
                .map(meeting => (
                  <MeetingCard key={meeting.id} {...meeting} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Start Instant Meeting</h3>
                      <p className="text-sm text-muted-foreground">No scheduling required</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">My Contacts</h3>
                      <p className="text-sm text-muted-foreground">Manage your Contacts</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <CalendarClock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schedule Meeting</h3>
                      <p className="text-sm text-muted-foreground">Plan ahead with calendar</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New Meeting Dialog */}
      <Dialog open={newMeetingDialogOpen} onOpenChange={setNewMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Meeting.</DialogTitle>
            <DialogDescription>
              Start a new video meeting instantly or schedule for later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Button onClick={handleNewMeeting}>
                <Video className="mr-2 h-4 w-4" /> Start instant meeting.
              </Button>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Button variant="outline" disabled>
                <CalendarClock className="mr-2 h-4 w-4" /> Schedule for later.
                <span className="ml-1 text-xs">(Coming soon)</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Meeting Dialog */}
      <Dialog open={joinMeetingDialogOpen} onOpenChange={setJoinMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Meeting</DialogTitle>
            <DialogDescription>
              Enter the meeting code to join an existing meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinMeetingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinMeeting} disabled={!meetingCode.trim()}>
              Join Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Dashboard;
