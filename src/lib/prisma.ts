import { PrismaClient } from "@prisma/client"

// Instância do PrismaClient para ser usada em toda a aplicação
export const prisma = new PrismaClient()