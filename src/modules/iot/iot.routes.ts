// src/modules/iot/iot.routes.ts
import { Router } from "express"
import { IoTController } from "./iot.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const iotRouter = Router()
const iotController = new IoTController()

iotRouter.use(isAuthenticated)

iotRouter.post("/", iotController.create)
iotRouter.get("/", iotController.findAllByUser)
iotRouter.put("/:id", iotController.update)
iotRouter.delete("/:id", iotController.delete)

export { iotRouter }