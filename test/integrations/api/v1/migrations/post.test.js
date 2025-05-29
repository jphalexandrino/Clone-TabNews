import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymus user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const liveRunMigrations = async () =>
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "POST",
          });

        // First Response = Verificação de se as migrations foram enviadas.
        const firstResponse = await liveRunMigrations();
        expect(firstResponse.status).toBe(201);
        const firstResponseBody = await firstResponse.json();
        expect(Array.isArray(firstResponseBody)).toBe(true);
        expect(firstResponseBody.length).toBeGreaterThan(0);

        //Confere o corpo da primeira resposta.
        //console.log("First response body:", firstResponseBody);
      });
      test("For the second time", async () => {
        const liveRunMigrations = async () =>
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "POST",
          });

        // Second Response = Verifica se retornou alguma migration (não deve...).
        const secondResponse = await liveRunMigrations();
        expect(secondResponse.status).toBe(200);
        const secondResponseBody = await secondResponse.json();
        expect(Array.isArray(secondResponseBody)).toBe(true);
        expect(secondResponseBody.length).toBe(0);

        // Confere o Body da segunda resposta.
        //console.log("Second response body:", secondResponseBody);
      });
    });
  });
});
