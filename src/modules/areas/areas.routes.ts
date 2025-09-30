import { Router } from "express"
import { AreasController } from "./areas.controller.js"

// A opção { mergeParams: true } permite que este router acesse os parâmetros
// do router pai (no caso, o :propertyId do propertiesRouter)
const areasRouter = Router({ mergeParams: true })
const areasController = new AreasController()

areasRouter.post("/", areasController.create)
areasRouter.get("/", areasController.findAllByProperty)
areasRouter.put("/:areaId", areasController.update)
areasRouter.delete("/:areaId", areasController.delete)

export { areasRouter }