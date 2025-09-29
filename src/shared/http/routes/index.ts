import { Router } from "express"
import { authRouter } from "../../../modules/auth/auth.routes.js"
import { usersRouter } from "modules/users/users.routes.js"
import { distributorsRouter } from "modules/distributors/distributors.routes.js"

const mainRouter = Router()

mainRouter.use("/auth", authRouter)
mainRouter.use("/users", usersRouter)
mainRouter.use("/distributors", distributorsRouter)

export { mainRouter }