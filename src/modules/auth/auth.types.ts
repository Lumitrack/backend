import { z } from "zod";
import type { loginSchema, registerSchema } from "./auth.schemas.js";

export type LoginUserDTO = z.infer<typeof loginSchema>
export type RegisterUserDTO = z.infer<typeof registerSchema>