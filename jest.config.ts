import type { Config } from "jest"

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    clearMocks: true, // Limpa mocks entre os testes
    // Arquivo de setup que rodará antes de todos os testes
    setupFilesAfterEnv: ["./src/tests/setup.ts"], 
}

export default config