import { Router } from "express"
import { authRouter } from "../../../modules/auth/auth.routes.js"

const mainRouter = Router()

mainRouter.use("/auth", authRouter) // Agrupa as rotas de autenticação sob o prefixo /auth

export { mainRouter }