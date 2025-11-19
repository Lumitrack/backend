import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("IoT Module", () => {
    it("should create and link an IoT device to a property", async () => {
        const { token } = await createAndAuthenticateUser();

        // Setup
        const dist = await request(app).post('/api/distributors').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Distribuidora Teste', systemType: 'MONOPHASIC', voltage: 127, kwhPrice: 1 });
    
        const prop = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Casa Principal', type: 'RESIDENTIAL', zipCode: '0', address: 'A', city: 'C', state: 'S', country: 'B', distributorId: dist.body.id });

        // Teste: Criar IoT vinculado à Propriedade
        const response = await request(app)
        .post("/api/iot-devices")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Sensor Geral",
            linkTargetType: "PROPERTY",
            targetId: prop.body.id
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("apiKey");
        expect(response.body.propertyId).toBe(prop.body.id);
    });
});