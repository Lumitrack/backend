import request from "supertest";
import { app } from "../../../shared/http/app";

describe("Auth Module", () => {
    it("should register a new user successfully", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            userType: "PHYSICAL",
            birthDate: "1990-01-01T00:00:00Z",
            zipCode: "12345-678",
            address: "Rua Teste",
            city: "Cidade",
            state: "TS",
            country: "BR"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe("john@example.com");
    });

    it("should not register with invalid data (Zod Validation)", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "Jo", // Muito curto
            email: "invalid-email",
            // password faltando
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("validação");
    });

    it("should login successfully", async () => {
        // Primeiro registra
        await request(app).post("/api/auth/register").send({
            name: "Login User",
            email: "login@example.com",
            password: "password123",
            userType: "PHYSICAL",
            birthDate: "1990-01-01T00:00:00Z",
            zipCode: "12345",
            address: "Rua",
            city: "C",
            state: "S",
            country: "C"
        });

        // Tenta login
        const response = await request(app).post("/api/auth/login").send({
            email: "login@example.com",
            password: "password123",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
});