import { Router } from "express"
import { DevicesController } from "./devices.controller.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createDeviceSchema, updateDeviceSchema } from "./devices.schemas.js"

const devicesRouter = Router({ mergeParams: true })
const devicesController = new DevicesController()

devicesRouter.post("/", validateRequest(createDeviceSchema) ,devicesController.create)
devicesRouter.get("/", devicesController.findAllByArea)
devicesRouter.put("/:deviceId", validateRequest(updateDeviceSchema) ,devicesController.update)
devicesRouter.delete("/:deviceId", devicesController.delete)

export { devicesRouter }