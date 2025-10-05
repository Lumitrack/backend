export enum AlertTargetType {
    PROPERTY = "PROPERTY",
    AREA = "AREA",
    DEVICE = "DEVICE",
}

export type CreateAlertRuleDTO = {
    name: string
    threshold: number // Limite de consumo em kWh
    timeWindow: number // Janela de tempo em horas (ex: 24 para diário, 720 para mensal)
    targetType: AlertTargetType
    targetId: string // ID da propriedade, área ou aparelho
}

export type UpdateAlertRuleDTO = {
    name?: string
    threshold?: number
    timeWindow?: number
    isEnabled?: boolean
}