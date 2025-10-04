import { Router } from "express"
import { authRouter } from "../../../modules/auth/auth.routes.js"
import { usersRouter } from "modules/users/users.routes.js"
import { distributorsRouter } from "modules/distributors/distributors.routes.js"
import { propertiesRouter } from "modules/properties/properties.routes.js"
import { iotRouter } from "modules/iot/iot.routes.js"

const mainRouter = Router()

mainRouter.use("/auth", authRouter)
mainRouter.use("/users", usersRouter)
mainRouter.use("/distributors", distributorsRouter)
mainRouter.use('/properties', propertiesRouter)
mainRouter.use('/iot-devices', iotRouter)

export { mainRouter }