import { Router } from "express"
import { AuthController } from "./auth.controller.js"
import { isAuthenticated } from "shared/middlewares/isAuthenticated.js"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)
authRouter.post("/logout", isAuthenticated, authController.logout)

export { authRouter }