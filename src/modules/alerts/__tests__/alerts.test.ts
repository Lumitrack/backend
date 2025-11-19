import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Alerts Module", () => {
    it("should create an alert rule", async () => {
        const { token } = await createAndAuthenticateUser();


        const dist = await request(app).post('/api/distributors').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Distribuidora', systemType: 'MONOPHASIC', voltage: 127, kwhPrice: 1 });
        
        const prop = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Minha Propriedade', type: 'RESIDENTIAL', zipCode: '0', address: 'A', city: 'C', state: 'S', country: 'B', distributorId: dist.body.id });

        const response = await request(app)
        .post("/api/alerts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Alerta Alto Consumo",
            threshold: 100,
            timeWindow: 24,
            targetType: "PROPERTY",
            targetId: prop.body.id
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Alerta Alto Consumo");
        expect(response.body.propertyId).toBe(prop.body.id);
    });
});