import { Router } from "express"
import { PropertiesController } from "./properties.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { areasRouter } from "modules/areas/areas.routes.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createPropertySchema, updatePropertySchema } from "./properties.schemas.js"

const propertiesRouter = Router()
const propertiesController = new PropertiesController()

propertiesRouter.use(isAuthenticated)

propertiesRouter.post("/", validateRequest(createPropertySchema) ,propertiesController.create)
propertiesRouter.get("/", propertiesController.findAllByUser)
propertiesRouter.get("/:id", propertiesController.findById)
propertiesRouter.put("/:id", validateRequest(updatePropertySchema) ,propertiesController.update)
propertiesRouter.delete("/:id", propertiesController.delete)

propertiesRouter.use('/:propertyId/areas', areasRouter) 

export { propertiesRouter }