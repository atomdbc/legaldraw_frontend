// src/lib/api/support.ts
import { authApi } from './auth';
import type { 
  SupportTicket, 
  CreateTicketData, 
  UpdateTicketData, 
  CreateResponseData, 
  TicketResponse 
} from '@/types/support';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.59.116.14';

export class SupportApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'SupportApiError';
  }

  toJSON() {
    return {
      name: this.name,
      error: this.error
    };
  }
}

export const supportApi = {
  async createTicket(data: CreateTicketData): Promise<SupportTicket> {
    try {
      const response = await authApi.authenticatedRequest<SupportTicket>(
        `${API_BASE_URL}/support/tickets`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      throw new SupportApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to create support ticket',
        code: 'CREATE_TICKET_ERROR'
      });
    }
  },

  async getUserTickets(): Promise<SupportTicket[]> {
    try {
      const response = await authApi.authenticatedRequest<SupportTicket[]>(
        `${API_BASE_URL}/support/tickets`
      );
      return response;
    } catch (error: any) {
      throw new SupportApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch tickets',
        code: 'GET_TICKETS_ERROR'
      });
    }
  },

  async getTicket(ticketId: string): Promise<SupportTicket> {
    try {
      const response = await authApi.authenticatedRequest<SupportTicket>(
        `${API_BASE_URL}/support/tickets/${ticketId}`
      );
      return response;
    } catch (error: any) {
      throw new SupportApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch ticket',
        code: 'GET_TICKET_ERROR'
      });
    }
  },

  async addResponse(ticketId: string, data: CreateResponseData): Promise<TicketResponse> {
    try {
      const response = await authApi.authenticatedRequest<TicketResponse>(
        `${API_BASE_URL}/support/tickets/${ticketId}/responses`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      throw new SupportApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to add response',
        code: 'ADD_RESPONSE_ERROR'
      });
    }
  },

  async updateTicket(ticketId: string, data: UpdateTicketData): Promise<SupportTicket> {
    try {
      const response = await authApi.authenticatedRequest<SupportTicket>(
        `${API_BASE_URL}/support/tickets/${ticketId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      throw new SupportApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update ticket',
        code: 'UPDATE_TICKET_ERROR'
      });
    }
  }
};