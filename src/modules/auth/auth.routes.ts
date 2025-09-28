import { Router } from "express"
import { AuthController } from "./auth.controller.js"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/register", authController.register) // Define a rota POST para /register

export { authRouter }