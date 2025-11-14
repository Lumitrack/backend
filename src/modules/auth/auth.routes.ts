import { Router } from "express"
import { AuthController } from "./auth.controller.js"
import { isAuthenticated } from "shared/middlewares/isAuthenticated.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { loginSchema, registerSchema } from "./auth.schemas.js"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/register", validateRequest(registerSchema), authController.register)
authRouter.post("/login", validateRequest(loginSchema) , authController.login)
authRouter.post("/logout", isAuthenticated, authController.logout)

export { authRouter }