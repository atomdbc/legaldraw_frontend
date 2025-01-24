
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WaitlistEntry {
  name: string;
  email: string;
}

export interface WaitlistResponse {
  status: string;
  message: string;
  data: {
    name: string;
    email: string;
  };
}

export class WaitlistApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'WaitlistApiError';
  }

  toJSON() {
    return {
      name: this.name,
      error: this.error
    };
  }
}

export const waitlistApi = {
  async joinWaitlist(data: WaitlistEntry): Promise<WaitlistResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new WaitlistApiError({
          status: response.status,
          message: error.detail || 'Failed to join waitlist',
          code: 'JOIN_WAITLIST_ERROR'
        });
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof WaitlistApiError) {
        throw error;
      }
      throw new WaitlistApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to join waitlist',
        code: 'JOIN_WAITLIST_ERROR'
      });
    }
  }
};