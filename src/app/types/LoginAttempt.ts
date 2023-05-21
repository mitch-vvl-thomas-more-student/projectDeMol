export interface LoginAttempt {
    userId: string;
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
    succes: boolean;
  }