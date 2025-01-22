import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supportApi } from '@/lib/api/support';
import type { 
  SupportTicket, 
  CreateTicketData, 
  UpdateTicketData, 
  CreateResponseData,
  TicketResponse 
} from '@/types/support';

export interface TicketResponseWithTicket {
  response: TicketResponse;
  ticket: SupportTicket;
}

export const useSupport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createTicket = async (data: CreateTicketData): Promise<SupportTicket | null> => {
    setIsLoading(true);
    try {
      const ticket = await supportApi.createTicket(data);
      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });
      return ticket;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create ticket",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTickets = async (): Promise<SupportTicket[]> => {
    setIsLoading(true);
    try {
      const tickets = await supportApi.getUserTickets();
      return tickets;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch tickets",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketDetails = async (ticketId: string): Promise<SupportTicket | null> => {
    setIsLoading(true);
    try {
      const ticket = await supportApi.getTicket(ticketId);
      return ticket;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch ticket details",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addResponse = async (
    ticketId: string, 
    data: CreateResponseData
  ): Promise<TicketResponseWithTicket | null> => {
    setIsLoading(true);
    try {
      const response = await supportApi.addResponse(ticketId, data);
      toast({
        title: "Success",
        description: "Response added successfully",
      });
      return response;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add response",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (
    ticketId: string, 
    data: UpdateTicketData
  ): Promise<SupportTicket | null> => {
    setIsLoading(true);
    try {
      const ticket = await supportApi.updateTicket(ticketId, data);
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      return ticket;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update ticket",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createTicket,
    getUserTickets,
    getTicketDetails,
    addResponse,
    updateTicket
  };
};