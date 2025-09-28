
import express from "express"
import "express-async-errors"
import cors from "cors"

const app = express()

// Middlewares
app.use(cors()) // Permite que diferentes origens acessem a API
app.use(express.json()) // Permite que a API entenda requisições com corpo em JSON

// Rota de teste para verificar se o servidor está no ar
app.get("/", (request, response) => {
    return response.json({ status: "API is running!" })
})

export { app }