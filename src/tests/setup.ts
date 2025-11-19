import { exec } from "node:child_process";
import { prisma } from "../lib/prisma.js";

// Roda antes de toda a suíte de testes
beforeAll(async () => {
    // Garante que o banco de teste está atualizado
    await new Promise<void>((resolve, reject) => {
        exec("npm run test:migrate", (err, stdout) => {
        if (err) {
            console.error(stdout);
            reject(err);
        }
        resolve();
        });
    });
});

// Roda antes de CADA teste
beforeEach(async () => {
    // Limpa todas as tabelas para garantir isolamento
    const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
        if (tablename !== "_prisma_migrations") {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`);
        }
    }
});

// Roda depois de toda a suíte de testes
afterAll(async () => {
  // Desconecta do Prisma
    await prisma.$disconnect();
});