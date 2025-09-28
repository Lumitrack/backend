import { Router } from "express"
import { AuthController } from "./auth.controller.js"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/register", authController.register) // Define a rota POST para /register
authRouter.post('/login', authController.login) // Define a rota POST para /login

export { authRouter }