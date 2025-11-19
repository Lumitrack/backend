import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Devices Module", () => {
    it("should create a device inside an area", async () => {
        const { token } = await createAndAuthenticateUser();

        // Setup: Distribuidora -> Propriedade -> Área
        const dist = await request(app).post('/api/distributors').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Distribuidora', systemType: 'MONOPHASIC', voltage: 127, kwhPrice: 1 });

        const prop = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Propriedade Teste', type: 'RESIDENTIAL', zipCode: '0', address: 'A', city: 'C', state: 'S', country: 'B', distributorId: dist.body.id });

        const area = await request(app).post(`/api/properties/${prop.body.id}/areas`).set('Authorization', `Bearer ${token}`)
        .send({ name: 'Área de Teste' });

        // Teste: Criar Dispositivo
        const response = await request(app)
        .post(`/api/properties/${prop.body.id}/areas/${area.body.id}/devices`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Geladeira",
            voltage: 127,
            power: 200
        });

        expect(response.status).toBe(201);
        expect(response.body.areaId).toBe(area.body.id);
    });
});