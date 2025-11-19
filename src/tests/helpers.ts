import request from "supertest";
import { app } from "../shared/http/app.js";
import { prisma } from "../lib/prisma.js";
import { hash } from "bcryptjs";

export async function createAndAuthenticateUser() {
    // 1. Cria o usuário no banco
    const password = await hash("password123", 8);
    const user = await prisma.user.create({
        data: {
            name: "Test User",
            email: `test-${Date.now()}@example.com`, // Email único
            password,
            userType: "PHYSICAL",
        },
    });

    // 2. Faz login para pegar o token
    const response = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: "password123",
    });

    return {
        user,
        token: response.body.token,
    };
}