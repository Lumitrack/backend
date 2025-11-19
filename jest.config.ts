import type { Config } from "jest"

const config: Config = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    clearMocks: true, // Limpa mocks entre os testes

    // Arquivo de setup que rodará antes de todos os testes
    setupFilesAfterEnv: ["./src/tests/setup.ts"],

    // Informa ao Jest que arquivos .ts são módulos ESM
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        // Regras específicas para remover o .js dos imports absolutos (baseUrl)
        "^lib/(.*)\\.js$": "<rootDir>/src/lib/$1",
        "^shared/(.*)\\.js$": "<rootDir>/src/shared/$1",
        "^modules/(.*)\\.js$": "<rootDir>/src/modules/$1",

        // Regras de fallback para imports sem extensão (se houver)
        "^lib/(.*)$": "<rootDir>/src/lib/$1",
        "^shared/(.*)$": "<rootDir>/src/shared/$1",
        "^modules/(.*)$": "<rootDir>/src/modules/$1",

        // Regra para imports relativos (./ ou ../)
        "^(\\.{1,2}/.*)\\.js$": "$1",

    },

    // Configura o ts-jest para processar arquivos com suporte a ESM
    transform: {
        '^.+\\.tsx?$': [
        'ts-jest',
        {
            useESM: true,
        },
        ],
    },

    collectCoverage: false, // Mantemos false por padrão para não deixar o teste lento no dia a dia
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts", // Inclui todos os arquivos .ts em src
        "!<rootDir>/src/@types/**/*", // Exclui definições de tipos
        "!<rootDir>/src/tests/**/*",  // Exclui arquivos de configuração de teste
        "!<rootDir>/src/**/*.spec.ts", // Exclui os próprios arquivos de teste
        "!<rootDir>/src/shared/http/server.ts", // Exclui o ponto de entrada (difícil de testar via Jest)
        "!<rootDir>/src/lib/prisma.ts" // Exclui configuração de libs externas
    ],
    coverageReporters: [
        "text-summary", // Resumo no terminal
        "lcov",         // Relatório HTML detalhado
    ],
}

export default config