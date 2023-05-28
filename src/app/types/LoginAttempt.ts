export interface LoginAttempt {
    userId: string;
    IPv4: string;
    datetime: Date;
    dateString?: string;
    location: {
      latitude: string;
      longitude: string;
    }
    system: {
      model: string;
      platform: string;
      osVersion: string;
    }
    method: string;
    success: boolean;
  }