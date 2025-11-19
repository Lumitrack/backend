import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Properties Module", () => {
    it("should create a property linked to a distributor", async () => {
        const { token } = await createAndAuthenticateUser();

        // 1. Criar Distribuidora
        const distResponse = await request(app)
        .post("/api/distributors")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Enel", systemType: "TRIPHASIC", voltage: 127, kwhPrice: 0.8 });
        
        const distributorId = distResponse.body.id;

        // 2. Criar Propriedade
        const response = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Minha Casa",
            type: "RESIDENTIAL",
            zipCode: "12345678",
            address: "Rua A",
            city: "Cidade",
            state: "ST",
            country: "BR",
            distributorId // Link obrigatório
        });

        expect(response.status).toBe(201);
        expect(response.body.distributorId).toBe(distributorId);
    });

    it("should not create property with invalid distributor ID", async () => {
        const { token } = await createAndAuthenticateUser();

        const response = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Casa Inválida",
            type: "RESIDENTIAL",
            zipCode: "000",
            address: "Rua",
            city: "C",
            state: "S",
            country: "BR",
            distributorId: "41393396-9819-403f-8089-473462247416" // UUID válido mas inexistente
        });

        expect(response.status).toBe(400); // Ou 400 dependendo do seu tratamento de erro "Distribuidora não encontrada"
    });
});