import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Simulations Module", () => {
    it("should calculate estimated cost correctly", async () => {
        const { token } = await createAndAuthenticateUser();

        // Setup: Distribuidora com preço conhecido (R$ 1.00/kWh para facilitar a conta)
        const dist = await request(app).post('/api/distributors').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Distribuidora', systemType: 'MONOPHASIC', voltage: 127, kwhPrice: 1.00 });
        
        const prop = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Casa Simulação', type: 'RESIDENTIAL', zipCode: '0', address: 'A', city: 'C', state: 'S', country: 'B', distributorId: dist.body.id });

        // Aparelho: 1000W (1kW), usado 5h/dia. Consumo diário = 5kWh.
        // Período: "day" (1 dia).
        // Custo esperado: 5kWh * R$1.00 = R$5.00

        const response = await request(app)
        .post("/api/simulations/cost")
        .set("Authorization", `Bearer ${token}`)
        .send({
            propertyId: prop.body.id,
            period: "day",
            devices: [
            { name: "Test Device", power: 1000, usageHoursPerDay: 5 }
            ]
        });

        expect(response.status).toBe(200);
        expect(response.body.totalConsumptionKwh).toBe(5);
        expect(response.body.totalEstimatedCost).toBe(5);
    });
});