'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupport } from "@/hooks/useSupport";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { 
  PlusCircle, 
  Loader2, 
  AlertCircle, 
  MessageSquare,
  Search,
  Filter,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X
} from "lucide-react";
import type { 
  SupportTicket, 
  CreateTicketData, 
  TicketCategory, 
  TicketPriority,
  TicketResponse
} from "@/types/support";
import { useToast } from '@/hooks/use-toast';

// Helper functions
function getStatusColor(status: string) {
  const colors = {
    OPEN: "bg-blue-500 hover:bg-blue-600",
    IN_PROGRESS: "bg-yellow-500 hover:bg-yellow-600",
    RESOLVED: "bg-green-500 hover:bg-green-600",
    CLOSED: "bg-gray-500 hover:bg-gray-600",
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
}

function getPriorityIcon(priority: string) {
  const icons = {
    LOW: <Clock className="h-4 w-4 text-blue-500" />,
    MEDIUM: <Info className="h-4 w-4 text-yellow-500" />,
    HIGH: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    URGENT: <AlertCircle className="h-4 w-4 text-red-500" />
  };
  return icons[priority as keyof typeof icons] || <Info className="h-4 w-4" />;
}

function getResponseStyles(response: TicketResponse) {
  if (response.is_support) {
    return {
      containerClass: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-l-4 border-blue-500',
      labelClass: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      label: 'Support Team'
    };
  }
  
  if (response.is_internal) {
    return {
      containerClass: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-l-4 border-gray-500',
      labelClass: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      label: 'Internal Note'
    };
  }
  
  return {
    containerClass: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-l-4 border-green-500',
    labelClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    label: 'You'
  };
}

// Components
function TicketResponse({ response }: { response: TicketResponse }) {
  const styles = getResponseStyles(response);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("p-4 shadow-sm transform transition-all duration-200 hover:shadow-md", styles.containerClass)}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-medium px-2 py-1 rounded-full", styles.labelClass)}>
              {styles.label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(response.created_at).toLocaleDateString()} {' '}
            {new Date(response.created_at).toLocaleTimeString()}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed mt-2">{response.message}</p>
      </Card>
    </motion.div>
  );
}

export default function SupportClient() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TicketPriority>('all');
  const { isLoading, createTicket, getUserTickets } = useSupport();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const fetchedTickets = await getUserTickets();
      setTickets(fetchedTickets);
      if (selectedTicket) {
        const updatedTicket = fetchedTickets.find(t => t.id === selectedTicket.id);
        if (updatedTicket) setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
    }
  };

  const handleCreateTicket = async (data: CreateTicketData) => {
    try {
      const newTicket = await createTicket(data);
      setTickets(prev => [newTicket, ...prev]);
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleTicketUpdate = (updatedTicket: SupportTicket) => {
    if (!updatedTicket?.id) return;
    setTickets(prev => prev.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
    setSelectedTicket(updatedTicket);
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'open' && ['OPEN', 'IN_PROGRESS'].includes(ticket.status)) ||
      (statusFilter === 'closed' && ['RESOLVED', 'CLOSED'].includes(ticket.status));

    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderMobileView = () => (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
        <h1 className="text-xl font-semibold">Support</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <CreateTicketForm onSubmit={handleCreateTicket} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Ticket List */}
      <AnimatePresence>
        {isLoading && tickets.length === 0 ? (
          <LoadingState />
        ) : filteredTickets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredTickets.map((ticket) => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onClick={() => setSelectedTicket(ticket)}
                isMobile
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState isFiltered={!!searchQuery || statusFilter !== 'all'} />
        )}
      </AnimatePresence>

      {/* Mobile Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[100vw] h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-4 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle>{selectedTicket.title}</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created {new Date(selectedTicket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status}
                </Badge>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(selectedTicket.priority)}
                    <span className="text-sm font-medium">
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                </Card>

                {selectedTicket.responses.map((response) => (
                  <TicketResponse key={response.id} response={response} />
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <ResponseForm 
                ticketId={selectedTicket.id} 
                onSuccess={handleTicketUpdate}
                canAddInternalNotes={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  const renderDesktopView = () => (
    <div className="flex gap-6">
      {/* Desktop Sidebar */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Support</h2>
              <p className="text-sm text-muted-foreground">
                Get help with your questions
              </p>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Support Ticket</DialogTitle>
                </DialogHeader>
                <CreateTicketForm onSubmit={handleCreateTicket} />
              </DialogContent>
            </Dialog>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="flex-1 min-w-0">
        {/* Tickets List */}
        <AnimatePresence mode="wait">
          {isLoading && tickets.length === 0 ? (
            <LoadingState />
          ) : selectedTicket ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-lg shadow-lg overflow-hidden"
            >
              {/* Ticket Detail Header */}
              <div className="border-b p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedTicket(null)}
                        className="hover:bg-accent p-1 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <h2 className="text-xl font-semibold">{selectedTicket.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>#{selectedTicket.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span>{new Date(selectedTicket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(selectedTicket.priority)}
                    <span className="text-sm">{selectedTicket.priority} Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedTicket.responses.length} {selectedTicket.responses.length === 1 ? 'response' : 'responses'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Original Description */}
                  <Card className="p-4">
                    <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                  </Card>

                  {/* Responses */}
                  {selectedTicket.responses.map((response) => (
                    <TicketResponse key={response.id} response={response} />
                  ))}
                </div>
              </div>

              {/* Response Form */}
              <div className="border-t p-6">
                <ResponseForm 
                  ticketId={selectedTicket.id} 
                  onSuccess={handleTicketUpdate}
                  canAddInternalNotes={false}
                />
              </div>
            </motion.div>
          ) : filteredTickets.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredTickets.map((ticket) => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onClick={() => setSelectedTicket(ticket)}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState isFiltered={!!searchQuery || statusFilter !== 'all'} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="container py-6 max-w-7xl">
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ isFiltered = false }: { isFiltered?: boolean }) {
  return (
    <Card className="p-8 text-center">
      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/60" />
      <h3 className="mt-4 text-lg font-medium">No Support Tickets</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {isFiltered 
          ? "No tickets match your current filters" 
          : "Create a new ticket to get help from our support team"}
      </p>
    </Card>
  );
}

function CreateTicketForm({ onSubmit }: { onSubmit: (data: CreateTicketData) => Promise<void> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const data: CreateTicketData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as TicketCategory,
        priority: formData.get('priority') as TicketPriority,
      };

      await onSubmit(data);
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Brief description of your issue"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="BILLING">Billing</SelectItem>
              <SelectItem value="DOCUMENT_ISSUE">Document Issue</SelectItem>
              <SelectItem value="ACCOUNT">Account</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select name="priority" required>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Please provide details about your issue"
          required
          className="h-32"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
        ) : (
          "Create Ticket"
        )}
      </Button>
    </form>
  );
}

function TicketCard({ 
  ticket, 
  onClick,
  isMobile = false 
}: { 
  ticket: SupportTicket; 
  onClick: () => void;
  isMobile?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-4 hover:shadow-md cursor-pointer transition-all"
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getPriorityIcon(ticket.priority)}
              <h3 className="font-medium truncate">{ticket.title}</h3>
            </div>
            {!isMobile && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {ticket.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>#{ticket.id.slice(0, 8)}</span>
              <span>•</span>
              <MessageSquare className="h-3 w-3" />
              <span>{ticket.responses.length}</span>
              <span>•</span>
              <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}

function ResponseForm({ 
  ticketId, 
  onSuccess,
  canAddInternalNotes = false
}: { 
  ticketId: string; 
  onSuccess: (ticket: SupportTicket) => void;
  canAddInternalNotes?: boolean;
}) {
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { addResponse, getTicketDetails, isLoading } = useSupport();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await addResponse(ticketId, {
        message: message.trim(),
        is_internal: isInternal
      });
      
      const updatedTicket = await getTicketDetails(ticketId);
      
      if (updatedTicket) {
        setMessage('');
        setIsInternal(false);
        onSuccess(updatedTicket);
        
        toast({
          title: "Success",
          description: "Response sent successfully",
        });
      }
    } catch (error) {
      console.error('Failed to send response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send response. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your response..."
        className="min-h-[100px]"
      />
      {canAddInternalNotes && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="internal"
            checked={isInternal}
            onCheckedChange={(checked) => setIsInternal(checked as boolean)}
          />
          <Label htmlFor="internal">Internal Note</Label>
        </div>
      )}
      <Button 
        type="submit" 
        disabled={isLoading || !message.trim()}
        className="w-full"
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
        ) : (
          "Send Response"
        )}
      </Button>
    </form>
  );
}