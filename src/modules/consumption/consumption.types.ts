import { LinkTargetType } from "../iot/iot.types.js"

export type CreateManualConsumptionDTO = {
    targetType: LinkTargetType // PROPERTY, AREA, ou DEVICE
    targetId: string
    consumption: number
    timestamp: string
}