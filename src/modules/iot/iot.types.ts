export enum LinkTargetType {
    PROPERTY = "PROPERTY",
    AREA = "AREA",
    DEVICE = "DEVICE",
}

export type CreateIoTDeviceDTO = {
    name: string
    linkTargetType: LinkTargetType
    targetId: string
}

export type UpdateIoTDeviceDTO = {
    name?: string
}