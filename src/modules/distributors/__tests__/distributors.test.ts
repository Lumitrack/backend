import request from "supertest";
import { app } from "../../../shared/http/app";
import { createAndAuthenticateUser } from "../../../tests/helpers";

describe("Distributors Module", () => {
    it("should create a distributor", async () => {
        const { token } = await createAndAuthenticateUser();

        const response = await request(app)
        .post("/api/distributors")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Cemig",
            systemType: "BIPHASIC",
            voltage: 220,
            kwhPrice: 0.95,
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Cemig");
    });

    it("should list only users distributors", async () => {
        const user1 = await createAndAuthenticateUser();
        const user2 = await createAndAuthenticateUser();

        // User 1 cria uma distribuidora
        await request(app)
        .post("/api/distributors")
        .set("Authorization", `Bearer ${user1.token}`)
        .send({ name: "Dist 1", systemType: "MONOPHASIC", voltage: 127, kwhPrice: 1 });

        // User 2 tenta listar
        const response = await request(app)
        .get("/api/distributors")
        .set("Authorization", `Bearer ${user2.token}`);

        expect(response.body).toHaveLength(0); // Não deve ver a do User 1
    });
});