import { Router } from "express"
import { UsersController } from "./users.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const usersRouter = Router()
const usersController = new UsersController()

// Todas as rotas declaradas APÓS esta linha exigirão um token válido.
usersRouter.use(isAuthenticated)

usersRouter.get("/profile", usersController.getProfile)

export { usersRouter }