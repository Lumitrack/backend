import { z } from "zod"

export const loginSchema = z.object({
    email: z.email("O e-mail fornecido é inválido."),
    password: z.string().min(1, "A senha é obrigatória."),
})

const baseUserSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.email("O e-mail fornecido é inválido."),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
})

const physicalPersonSchema = baseUserSchema.extend({
    userType: z.literal("PHYSICAL"),
    birthDate: z.iso.datetime({ message: "A data de nascimento deve estar no formato ISO 8601." }),
    zipCode: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
})

const corporationSchema = baseUserSchema.extend({
    userType: z.literal("CORPORATION"),
    fantasyName: z.string(),
    cnpj: z.string(),
    zipCode: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
})

export const registerSchema = z.discriminatedUnion("userType", [
    physicalPersonSchema,
    corporationSchema,
])