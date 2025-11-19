import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Areas Module", () => {
    it("should create an area inside a property", async () => {
        const { token } = await createAndAuthenticateUser();

        // 1. Criar Distribuidora
        const distResponse = await request(app)
        .post("/api/distributors")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Dist", systemType: "MONOPHASIC", voltage: 127, kwhPrice: 0.5 });

        // 2. Criar Propriedade
        const propResponse = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Minha Casa",
            type: "RESIDENTIAL",
            zipCode: "00000",
            address: "Rua",
            city: "C",
            state: "S",
            country: "B",
            distributorId: distResponse.body.id
        });

        const propertyId = propResponse.body.id;

        // 3. Criar Área
        const areaResponse = await request(app)
        .post(`/api/properties/${propertyId}/areas`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Cozinha",
            areaSize: 20
        });

        expect(areaResponse.status).toBe(201);
        expect(areaResponse.body.propertyId).toBe(propertyId);
    });

    it("should not create an area in another users property", async () => {
        const user1 = await createAndAuthenticateUser();
        const user2 = await createAndAuthenticateUser();

        // User 1 cria estrutura
        const dist = await request(app).post("/api/distributors").set("Authorization", `Bearer ${user1.token}`).send({ name: "D1", systemType: "MONOPHASIC", voltage: 127, kwhPrice: 1 });
        const prop = await request(app).post("/api/properties").set("Authorization", `Bearer ${user1.token}`).send({ name: "P1", type: "RESIDENTIAL", zipCode: "0", address: "A", city: "C", state: "S", country: "B", distributorId: dist.body.id });

        // User 2 tenta criar área na propriedade do User 1
        const response = await request(app)
        .post(`/api/properties/${prop.body.id}/areas`)
        .set("Authorization", `Bearer ${user2.token}`)
        .send({ name: "Invasão" });

        // Esperamos 404 ou 400 (dependendo da sua mensagem "Propriedade não encontrada ou não pertence...")
        expect(response.status).not.toBe(201);
        expect(response.body.message).toMatch(/não encontrada|não pertence/i);
    });
});