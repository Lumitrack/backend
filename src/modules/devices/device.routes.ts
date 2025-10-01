import { Router } from "express"
import { DevicesController } from "./device.controller.js"

const devicesRouter = Router({ mergeParams: true })
const devicesController = new DevicesController()

devicesRouter.post("/", devicesController.create)
devicesRouter.get("/", devicesController.findAllByArea)
devicesRouter.put("/:deviceId", devicesController.update)
devicesRouter.delete("/:deviceId", devicesController.delete)

export { devicesRouter }