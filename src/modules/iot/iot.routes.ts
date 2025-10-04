import { Router } from "express"
import { IoTController } from "./iot.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { IoTInsertionController } from "./iotInsertion.controller.js"

const iotRouter = Router()
const iotController = new IoTController()

iotRouter.use(isAuthenticated)

iotRouter.post("/", iotController.create)
iotRouter.get("/", iotController.findAllByUser)
iotRouter.put("/:id", iotController.update)
iotRouter.delete("/:id", iotController.delete)

const iotInsertionRouter = Router()
const insertionController = new IoTInsertionController()
iotInsertionRouter.post('/consumption', insertionController.logConsumption)

export { iotRouter, iotInsertionRouter }