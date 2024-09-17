export type AuthFormState =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        phone?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  // sessionId: number;
  userId: string;
  role: string;
  expiresAt: Date;
};
