import express, { type Request, type Response, type NextFunction } from "express"
import "express-async-errors"
import cors from "cors"
import { mainRouter } from "./routes/index.js"

const app = express()

app.use(cors()) // Permite que diferentes origens acessem a API
app.use(express.json()) // Permite que a API entenda requisições com corpo em JSON

app.use("/api", mainRouter) // Rotas principais sobre o prefixo API

// Rota de teste para verificar se o servidor está no ar
app.get("/", (request, response) => {
    return response.json({ status: "API is running!" })
})

// Middleware de tratamento de erros global
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        // Se for um erro conhecido da nossa aplicação
        return response.status(400).json({
        message: err.message,
        })
    }

    // Se for um erro inesperado do servidor
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error",
    })
})

export { app }