type UserBaseDTO = {
    email: string
    password: string
    name: string
}

type PhysicalPersonDTO = {
    userType: 'PHYSICAL'
    birthDate: string // Converte para DATE no service
    zipCode: string
    address: string
    city: string
    state: string
    country: string
}

type CorporationDTO = {
    userType: 'CORPORATION'
    fantasyName: string
    cnpj: string
    zipCode: string
    address: string
    city: string
    state: string
    country: string
}

export type RegisterUserDTO = UserBaseDTO & (PhysicalPersonDTO | CorporationDTO)