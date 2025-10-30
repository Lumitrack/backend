<div align="center">
  <img src="/public/logo_lumitrack.svg" alt="Lumitrack Logo" width="120"/>
  <h1>Lumitrack - API Backend</h1>
  <p><strong>API RESTful para o sistema de monitoramento de energia Lumitrack.</strong></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white" alt="PostgreSQL"/>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellowgreen" alt="Status"/>
</div>

---

## Sobre o Projeto

Este repositório contém o código-fonte do back-end para o projeto **Lumitrack**. Trata-se de uma API RESTful construída com Node.js e TypeScript, responsável por toda a lógica de negócio, gerenciamento de dados e autenticação de usuários da plataforma.

A API serve como o cérebro do ecossistema Lumitrack, fornecendo dados de forma segura e eficiente para os clientes web e mobile.

## Arquitetura

A API foi desenvolvida seguindo os princípios da **Arquitetura em Camadas (Layered Architecture)** para garantir a separação de responsabilidades, manutenibilidade e escalabilidade do código. A organização de pastas é modular, onde cada entidade principal do sistema possui seu próprio módulo.

* **Camada de Rotas (`Routes`):** Define os endpoints da API, os métodos HTTP e os conecta aos métodos dos Controllers.
* **Camada de Controladores (`Controllers`):** Recebe as requisições HTTP, valida parâmetros e o corpo da requisição, e chama a camada de Serviço apropriada. Não contém lógica de negócio.
* **Camada de Serviços (`Services`):** Onde reside toda a lógica de negócio da aplicação (validações, regras, cálculos, etc.). Orquestra as operações e interage com a camada de acesso a dados.
* **Camada de Acesso a Dados (`Prisma ORM`):** Abstrai a comunicação com o banco de dados PostgreSQL, realizando as operações de CRUD de forma segura e tipada.

### Fluxo de uma Requisição

O fluxograma abaixo ilustra o ciclo de vida de uma requisição em uma rota protegida.

```mermaid
graph TD
    A[Cliente 👤] --> |Requisição HTTP com Token| B(Express Router);
    B --> C{Middleware de Autenticação 🛡️};
    C --> |Token Válido ✅| D[Controller];
    C --> |Token Inválido/Revogado ❌| E[Resposta 401 Unauthorized];
    D --> |Chama o Serviço com dados| F[Service];
    F --> |Executa a Lógica de Negócio e valida posse| F;
    F --> |Solicita Dados| G(Prisma Client);
    G --> |Executa Query| H[(PostgreSQL DB 🐘)];
    H --> |Retorna Dados| G;
    G --> |Entrega Dados| F;
    F --> |Retorna Resultado| D;
    D --> |Envia Resposta HTTP| A;
```

## Modelagem de Dados

A estrutura de dados foi modelada para suportar as funcionalidades do sistema de forma relacional e íntegra, com foco na posse dos dados pelo usuário.

### Diagrama de Entidade-Relacionamento (ERD)

Este diagrama representa as tabelas do banco de dados e suas chaves estrangeiras.

```mermaid
erDiagram
    User {
        String id PK
        String email UK
        UserType userType
    }
    PhysicalPersonProfile {
        String id PK
        String userId FK, UK
    }
    CorporationProfile {
        String id PK
        String userId FK, UK
    }
    Property {
        String id PK
        String name
        String userId FK
        String distributorId FK
    }
    EnergyDistributor {
        String id PK
        String name
        Float kwhPrice
        String userId FK
    }
    Area {
        String id PK
        String name
        String propertyId FK
    }
    Device {
        String id PK
        String name
        String areaId FK
    }
    IoTDevice {
        String id PK
        String name
        String apiKey UK
        String propertyId FK
        String areaId FK
        String deviceId FK
    }
    EnergyConsumption {
        String id PK
        Float consumption
        DateTime timestamp
        String propertyId FK
        String areaId FK
        String deviceId FK
    }
    AlertRule {
        String id PK
        String name
        Float threshold
        String propertyId FK
        String areaId FK
        String deviceId FK
    }
    Notification {
        String id PK
        String message
        Boolean isRead
        String alertRuleId FK
    }
    RevokedToken {
        String id PK
        String token UK
    }

    User ||--o{ PhysicalPersonProfile : "has"
    User ||--o{ CorporationProfile : "has"
    User ||--|{ EnergyDistributor : "registers"
    User ||--|{ Property : "owns"
    Property ||--|{ Area : "contains"
    Area ||--|{ Device : "contains"
    EnergyDistributor }o--|| Property : "is supplied by"
    Property }o..|| IoTDevice : "can have"
    Area }o..|| IoTDevice : "can have"
    Device }o..|| IoTDevice : "can have"
    Property }o..|| EnergyConsumption : "records"
    Area }o..|| EnergyConsumption : "records"
    Device }o..|| EnergyConsumption : "records"
    AlertRule ||--o{ Notification : "generates"
    Property }o..|| AlertRule : "can have"
    Area }o..|| AlertRule : "can have"
    Device }o..|| AlertRule : "can have"
```

### Diagrama de Classes

Este diagrama oferece uma visão mais orientada a objetos dos principais modelos de domínio do sistema.

```mermaid
classDiagram
    class User {
      +id: string
      +email: string
      +register()
      +login()
      +logout()
    }
    class Property {
      +id: string
      +name: string
      +addArea(Area)
      +linkDistributor(EnergyDistributor)
    }
    class Area {
      +id: string
      +name: string
      +addDevice(Device)
    }
    class Device {
      +id: string
      +name: string
      +addConsumptionRecord(EnergyConsumption)
    }
    class IoTDevice {
        +id: string
        +apiKey: string
        +linkTo(target)
    }
    class AlertRule {
      +id: string
      +threshold: float
      +checkAndTrigger()
    }
    class Notification {
        +id: string
        +message: string
        +markAsRead()
    }

    User "1" -- "0..*" Property : owns
    User "1" -- "0..*" EnergyDistributor : registers
    Property "1" -- "1" EnergyDistributor : suppliedBy
    Property "1" -- "0..*" Area : contains
    Area "1" -- "0..*" Device : contains
    Property "0..1" -- "0..*" IoTDevice : monitoredBy
    Area "0..1" -- "0..*" IoTDevice : monitoredBy
    Device "0..1" -- "0..1" IoTDevice : monitoredBy
    AlertRule "1" -- "0..*" Notification : generates
```

## Autenticação e Segurança

A autenticação é baseada em JSON Web Tokens (JWT). Após o login bem-sucedido, o cliente recebe um token de acesso que deve ser enviado em todas as requisições subsequentes para rotas protegidas.

* **Token JWT:** O token deve ser incluído no cabeçalho `Authorization` com o esquema Bearer.
* **Logout:** A API implementa uma estratégia de "blocklist". Ao fazer logout, o token JWT do usuário é adicionado a uma tabela `RevokedToken`.
* **Middleware `isAuthenticated`:** Todas as rotas protegidas passam por este middleware, que verifica a validade da assinatura do token e também consulta a tabela `RevokedToken` para garantir que o token não foi invalidado.

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant API as 🌐 Lumitrack API

    User->>API: POST /api/auth/login (com email e senha)
    API->>API: Verifica as credenciais no banco de dados
    alt Credenciais Válidas
        API->>API: Gera um Token JWT assinado com o JWT_SECRET
        API-->>User: Resposta 200 OK (com o Token JWT)
    else Credenciais Inválidas
        API-->>User: Resposta 400/401 (com erro)
    end

    User->>API: GET /api/users/profile (Header: "Authorization: Bearer <token>")
    API->>API: Middleware verifica assinatura e blocklist do token
    alt Token Válido
        API-->>User: Resposta 200 OK (com os dados do perfil)
    else Token Inválido/Revogado
        API-->>User: Resposta 401 Unauthorized
    end
```

## Configuração do Ambiente

Siga os passos abaixo para configurar e executar o projeto em um ambiente de desenvolvimento local.

### Pré-requisitos

* Node.js (v20.x ou superior)
* npm ou outro gerenciador de pacotes
* PostgreSQL (v14 ou superior)
* Git

#### Passos

1. Clone o repositório:

    ```bash
    git clone [https://github.com/lumitrack/lumitrack-backend.git](https://github.com/lumitrack/lumitrack-backend.git)
    cd lumitrack-backend
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o banco de dados:

    * Crie um usuário e um banco de dados no PostgreSQL para a aplicação. Lembre-se de conceder a permissão CREATEDB ao usuário.

4. Crie e configure o arquivo `.env`:

    * Crie um novo arquivo .env na raiz do projeto.
    * Preencha as variáveis de ambiente necessárias:

    ```env
    DATABASE_URL="postgresql://SEU_USER:SUA_SENHA@localhost:5432/lumitrack_db?schema=public"
    JWT_SECRET="GERAR_UMA_CHAVE_SECRETA_LONGA_E_ALEATORIA"
    ```

5. Aplique as migrações do banco de dados:

    * Este comando irá criar todas as tabelas no seu banco de dados com base nos arquivos de migração existentes.

    ```bash
    npx prisma migrate deploy
    ```

6. Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

    * A API estará disponível em <http://localhost:3333>.

## Tarefas Automatizadas (Cron Jobs)

O sistema utiliza `node-cron` para executar tarefas de manutenção em segundo plano.

* Limpeza de Tokens Revogados:

  * **Agendamento:** Diariamente à meia-noite (`0 0 * * *`).
  * **Ação:** Remove da tabela RevokedToken todos os tokens que já expiraram naturalmente, mantendo a tabela otimizada.

* Verificação de Alertas de Consumo:

  * Agendamento: A cada hora (`0 * * * *`).
  * Ação: Busca todas as regras de alerta ativas, compara com os dados de consumo recentes e cria notificações caso algum limite tenha sido ultrapassado.

## Endpoints da API

Abaixo, uma visão geral das rotas principais. Rotas marcadas com `[PROTEGIDO]` exigem um token de autenticação válido.

### Autenticação (`/api/auth`)

* `POST /register`: Cria um novo usuário (físico ou corporativo).
* `POST /login`: Autentica um usuário e retorna um token JWT.
* `POST /logout` ``[PROTEGIDO]``: Invalida o token JWT atual do usuário.

### Usuários (`/api/users`)

* `GET /profile` `[PROTEGIDO]`: Retorna os dados do perfil do usuário autenticado.

### CRUDs Principais (Todos os endpoints são `[PROTEGIDOS]`)

#### Distribuidoras (`/api/distributors`)

* `POST /`
* `GET /`
* `GET /:id`
* `PUT /:id`
* `DELETE /:id`

#### Propriedades (`/api/properties`)

* `POST /`
* `GET /`
* `GET /:id`
* `PUT /:id`
* `DELETE /:id`

#### Áreas (aninhado sob Propriedades)

* `POST /api/properties/:propertyId/areas`
* `GET /api/properties/:propertyId/areas`
* `PUT /api/properties/:propertyId/areas/:areaId`
* `DELETE /api/properties/:propertyId/areas/:areaId`

#### Dispositivos (aninhado sob Áreas)

* `POST /api/properties/:propertyId/areas/:areaId/devices`
* `GET /api/properties/:propertyId/areas/:areaId/devices`
* `PUT /api/properties/:propertyId/areas/:areaId/devices/:deviceId`
* `DELETE /api/properties/:propertyId/areas/:areaId/devices/: deviceId`

#### Dispositivos IoT (/api/iot-devices)

* `POST /` `[PROTEGIDO]`: Cria e vincula um novo dispositivo IoT a uma propriedade, área ou aparelho.
* `GET / ``[PROTEGIDO]`: Lista todos os dispositivos IoT do usuário.
* `PUT /:id`
* `DELETE /:id` `[PROTEGIDO]`

#### Consumo de Energia (/api/consumption e /api/iot)

* `POST /consumption/manual` `[PROTEGIDO]`: Registra uma entrada de consumo manualmente.
* `GET /consumption/history` `[PROTEGIDO]`: Busca o histórico de consumo agregado por período (?period=daily|monthly|annual).
* `POST /iot/consumption`: Endpoint público (M2M) para receber dados de consumo do broker MQTT (autenticação via apiKey).

#### Alertas e Notificações (/api/alerts e /api/notifications)

* `POST /alerts` `[PROTEGIDO]`: Cria uma nova regra de alerta.
* `GET /alerts` `[PROTEGIDO]`: Lista as regras do usuário.
* `PUT /alerts/:id`, DELETE /alerts/:id `[PROTEGIDO]`
* `GET /notifications` `[PROTEGIDO]`: Lista as notificações do usuário (?unread=true para filtrar).
* `GET /notifications/count` `[PROTEGIDO]`: Retorna a contagem de notificações não lidas.
* `PATCH /notifications/:id/read` `[PROTEGIDO]`: Marca uma notificação como lida.
* `POST /notifications/read-all` `[PROTEGIDO]`: Marca todas as notificações como lidas.

#### Simulações (/api/simulations)

* `POST /cost` `[PROTEGIDO]`: Calcula e retorna uma simulação de custo e consumo com base em dados hipotéticos.

## Como Contribuir

Contribuições são bem-vindas! Se você tem sugestões ou encontrou algum problema, por favor, abra uma Issue. Para contribuir com código, siga os passos:

1. Faça um Fork do projeto.
2. Crie uma Branch para sua feature (`git checkout -b feature/minha-feature`).
3. Faça o Commit de suas mudanças (`git commit -m 'feat: Adiciona minha-feature'`).
4. Faça o Push (`git push origin feature/minha-feature`).
5. Abra um Pull Request.
