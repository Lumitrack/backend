import { Router } from "express"
import { authRouter } from "../../../modules/auth/auth.routes.js"
import { usersRouter } from "modules/users/users.routes.js"
import { distributorsRouter } from "modules/distributors/distributors.routes.js"
import { propertiesRouter } from "modules/properties/properties.routes.js"
import { iotInsertionRouter, iotRouter } from "modules/iot/iot.routes.js"
import { consumptionRouter } from "modules/consumption/consumption.routes.js"
import { alertsRouter } from "modules/alerts/alerts.routes.js"
import { notificationsRouter } from "modules/notifications/notifications.routes.js"

const mainRouter = Router()

mainRouter.use("/auth", authRouter)
mainRouter.use("/users", usersRouter)
mainRouter.use("/distributors", distributorsRouter)
mainRouter.use("/properties", propertiesRouter)
mainRouter.use("/iot-devices", iotRouter)
mainRouter.use("/consumption", consumptionRouter)
mainRouter.use("/iot", iotInsertionRouter)
mainRouter.use("/alerts", alertsRouter)
mainRouter.use("/notifications", notificationsRouter)

export { mainRouter }