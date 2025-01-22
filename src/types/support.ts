// src/types/support.ts
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'DOCUMENT_ISSUE' | 'ACCOUNT' | 'GENERAL';

export interface TicketResponse {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  document_id?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  last_response_at?: string;
  responses: TicketResponse[];
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  document_id?: string;
}

export interface UpdateTicketData {
  status?: TicketStatus;
  assignee_id?: string;
  priority?: TicketPriority;
}

export interface CreateResponseData {
  message: string;
  is_internal?: boolean;
}