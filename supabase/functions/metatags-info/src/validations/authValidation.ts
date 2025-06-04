import { z } from "../config/deps.ts";

type SignUpData = {
  email: string;
  password: string;
};

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInValidation = (data: SignUpData) => {
  const result = SignInSchema.safeParse(data);
  if (!result.success) {
    return {
      error: true,
      message: result.error.format(),
    };
  }
  return {
    error: false,
    validatedData: result.data,
  };
};

export const signUpValidation = (data: SignUpData) => {
  const result = SignInSchema.safeParse(data);
  if (!result.success) {
    return {
      error: true,
      message: result.error.format(),
    };
  }
  return {
    error: false,
    validatedData: result.data,
  };
};
