import { Router } from "express"
import { IoTController } from "./iot.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { IoTInsertionController } from "./iotInsertion.controller.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createIoTDeviceSchema, updateIoTDeviceSchema } from "./iot.schemas.js"

const iotRouter = Router()
const iotController = new IoTController()

iotRouter.use(isAuthenticated)

iotRouter.post("/", validateRequest(createIoTDeviceSchema) ,iotController.create)
iotRouter.get("/", iotController.findAllByUser)
iotRouter.put("/:id", validateRequest(updateIoTDeviceSchema) ,iotController.update)
iotRouter.delete("/:id", iotController.delete)

const iotInsertionRouter = Router()
const insertionController = new IoTInsertionController()
iotInsertionRouter.post('/consumption', insertionController.logConsumption)

export { iotRouter, iotInsertionRouter }