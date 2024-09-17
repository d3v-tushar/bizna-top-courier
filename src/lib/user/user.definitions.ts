export type ClientFormState =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        dateOfBirth?: string[];
        taxCode?: string[];
        phone?: string[];
        image?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
