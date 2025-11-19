import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Consumption Module", () => {
    it("should allow manual log if NO IoT device is linked", async () => {
        const { token } = await createAndAuthenticateUser();

        // Setup
        const dist = await request(app).post('/api/distributors').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Distribuidora', systemType: 'MONOPHASIC', voltage: 127, kwhPrice: 1 });

        const prop = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Casa Manual', type: 'RESIDENTIAL', zipCode: '0', address: 'A', city: 'C', state: 'S', country: 'B', distributorId: dist.body.id });

        const response = await request(app)
        .post("/api/consumption/manual")
        .set("Authorization", `Bearer ${token}`)
        .send({
            targetType: "PROPERTY",
            targetId: prop.body.id,
            consumption: 10.5,
            timestamp: new Date().toISOString()
        });

        expect(response.status).toBe(201);
    });

    it("should BLOCK manual log if an IoT device IS linked", async () => {
        const { token } = await createAndAuthenticateUser();

        // Setup
        const dist = await request(app).post('/api/distributors').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Distribuidora', systemType: 'MONOPHASIC', voltage: 127, kwhPrice: 1 });
        
        const prop = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Casa Inteligente', type: 'RESIDENTIAL', zipCode: '0', address: 'A', city: 'C', state: 'S', country: 'B', distributorId: dist.body.id });

        // Vincula IoT
        await request(app).post("/api/iot-devices").set("Authorization", `Bearer ${token}`).send({
        name: "Sensor",
        linkTargetType: "PROPERTY",
        targetId: prop.body.id
        });

        // Tenta inserir manual
        const response = await request(app)
        .post("/api/consumption/manual")
        .set("Authorization", `Bearer ${token}`)
        .send({
            targetType: "PROPERTY",
            targetId: prop.body.id,
            consumption: 5,
            timestamp: new Date().toISOString()
        });

        expect(response.status).toBe(400); // Erro de validação de negócio
        expect(response.body.message).toMatch(/já é monitorada por um dispositivo IoT/i);
    });
});