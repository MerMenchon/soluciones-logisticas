
import { FormState } from "../types";

export type ValidationResult = {
  isValid: boolean;
  errors: {
    [key: string]: string | null;
  };
};
