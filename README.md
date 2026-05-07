# App Cílios Backend — Documentação Técnica

## Visão Geral

O projeto `app-cilios-backend` é uma API backend construída com NestJS para gerenciamento de atendimentos e operações de um sistema voltado para salão/estética.

A aplicação segue uma arquitetura modular baseada em módulos do NestJS, separando responsabilidades por domínio.

---

# Stack Tecnológica

## Backend

* Node.js
* TypeScript
* NestJS

## Banco de Dados

O projeto utiliza PostgreSQL com Prisma ORM.

## Datasource

```prisma
 datasource db {
   provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

---

# Modelagem de Dados

## User

Representa o usuário proprietário da conta/sistema.

### Campos

| Campo     | Tipo     | Descrição           |
| --------- | -------- | ------------------- |
| id        | String   | UUID do usuário     |
| name      | String   | Nome do usuário     |
| email     | String   | Email único         |
| password  | String   | Senha criptografada |
| createdAt | DateTime | Data de criação     |

### Relacionamentos

* 1:N com Client
* 1:N com Appointment
* 1:N com Service

---

## Client

Representa clientes cadastrados.

### Campos

| Campo     | Tipo     | Descrição               |
| --------- | -------- | ----------------------- |
| id        | String   | UUID                    |
| name      | String   | Nome do cliente         |
| phone     | String   | Telefone                |
| notes     | String?  | Observações             |
| userId    | String   | Proprietário do cliente |
| createdAt | DateTime | Data de criação         |

### Relacionamentos

* N:1 com User
* 1:N com Appointment

---

## Service

Representa serviços oferecidos.

### Campos

| Campo     | Tipo     | Descrição               |
| --------- | -------- | ----------------------- |
| id        | String   | UUID                    |
| name      | String   | Nome do serviço         |
| price     | Float    | Valor do serviço        |
| duration  | Int      | Duração em minutos      |
| userId    | String   | Proprietário do serviço |
| createdAt | DateTime | Data de criação         |

### Relacionamentos

* N:1 com User
* 1:N com Appointment

---

## Appointment

Representa os agendamentos.

### Campos

| Campo     | Tipo     | Descrição                |
| --------- | -------- | ------------------------ |
| id        | String   | UUID                     |
| date      | DateTime | Data/hora do atendimento |
| duration  | Int      | Duração do atendimento   |
| status    | String   | Status do atendimento    |
| serviceId | String?  | Serviço relacionado      |
| clientId  | String   | Cliente relacionado      |
| userId    | String   | Usuário proprietário     |
| createdAt | DateTime | Data de criação          |

### Relacionamentos

* N:1 com User
* N:1 com Client
* N:1 com Service

---

# Regras de Negócio

## Usuários

* Email deve ser único
* Usuário é proprietário dos dados
* Cada usuário possui seus próprios clientes, serviços e agendamentos

## Clientes

* Cliente pertence a um único usuário
* Cliente pode possuir múltiplos agendamentos
* Observações são opcionais

## Serviços

* Serviço possui valor monetário
* Serviço possui duração padrão
* Serviço pertence a um usuário

## Agendamentos

* Agendamento pertence a um cliente
* Agendamento pertence a um usuário
* Serviço pode ser opcional
* Status padrão é `scheduled`
* Duração padrão é 60 minutos

---

# Estrutura do Projeto

```txt
backend/
├── dist/
├── node_modules/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── appointment/
│   ├── auth/
│   ├── client/
│   ├── dashboard/
│   ├── prisma/
│   ├── service/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── .env
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# Arquitetura

A aplicação utiliza arquitetura modular do NestJS.

Cada domínio possui:

* Controller
* Service
* Module

Fluxo padrão:

```txt
Request → Controller → Service → Prisma → Database
```

---

# Módulos

## Auth Module

Responsável pela autenticação da aplicação.

### Arquivos

```txt
src/auth/
├── auth.controller.ts
├── auth.module.ts
├── auth.service.ts
└── jwt.guard.ts
```

### Responsabilidades

* Login de usuários
* Geração de token JWT
* Proteção de rotas
* Validação de autenticação

### Componentes

#### auth.controller.ts

Responsável pelos endpoints HTTP relacionados à autenticação.

Exemplos:

* login
* validação de token
* registro de usuário

#### auth.service.ts

Contém regras de negócio da autenticação.

Possíveis responsabilidades:

* validar credenciais
* gerar JWT
* comparar senhas
* buscar usuário

#### jwt.guard.ts

Middleware/Guard responsável por proteger rotas autenticadas.

---

# Client Module

Responsável pelo gerenciamento de clientes.

### Arquivos

```txt
src/client/
├── client.controller.ts
├── client.module.ts
└── client.service.ts
```

### Responsabilidades

* Cadastro de clientes
* Atualização de clientes
* Busca de clientes
* Remoção de clientes
* Histórico de relacionamento

### Fluxo

```txt
ClientController
   ↓
ClientService
   ↓
PrismaService
   ↓
Database
```

---

# Service Module

Responsável pelo gerenciamento dos serviços oferecidos.

### Arquivos

```txt
src/service/
├── service.controller.ts
├── service.module.ts
└── service.service.ts
```

### Responsabilidades

* Cadastro de serviços
* Valor dos serviços
* Duração
* Atualização de serviços
* Remoção

---

# Appointment Module

Responsável pelo agendamento.

### Arquivos

```txt
src/appointment/
├── appointment.controller.ts
├── appointment.module.ts
└── appointment.service.ts
```

### Responsabilidades

* Criar agendamentos
* Atualizar agendamentos
* Cancelar agendamentos
* Listar agenda
* Controle de horários

### Regras esperadas

* evitar conflito de horários
* validar cliente existente
* validar serviço existente
* controlar status do atendimento

---

# Dashboard Module

Responsável por métricas e indicadores.

### Arquivos

```txt
src/dashboard/
├── dashboard.controller.ts
├── dashboard.module.ts
└── dashboard.service.ts
```

### Responsabilidades

* KPIs
* Quantidade de atendimentos
* Receita
* Clientes cadastrados
* Relatórios resumidos

---

# Prisma Module

Camada responsável pela comunicação com o banco.

### Arquivos

```txt
src/prisma/
├── prisma.module.ts
└── prisma.service.ts
```

### Responsabilidades

* Gerenciar conexão com banco
* Disponibilizar Prisma Client
* Centralizar acesso aos dados

---

# Arquivos Principais

## main.ts

Ponto de entrada da aplicação.

Responsabilidades:

* inicialização do NestJS
* configuração global
* middlewares
* CORS
* pipes globais
* bootstrap da aplicação

---

## app.module.ts

Módulo raiz da aplicação.

Responsável por:

* importar módulos
* registrar providers
* centralizar configuração principal

---

# Banco de Dados

O projeto utiliza Prisma ORM.

## Arquivo Principal

```txt
prisma/schema.prisma
```

## Responsabilidades do schema

* modelos
* relacionamentos
* enums
* migrations
* constraints

## Possíveis entidades

Com base na estrutura:

* User
* Client
* Service
* Appointment

---

# Endpoints da API

## Root

### GET /

Health/check básico da aplicação.

#### Response

```json
"Hello World"
```

---

# Auth Endpoints

## POST /auth/register

Responsável pelo cadastro de usuários.

### Request

```json
{
  "name": "Brian",
  "email": "brian@email.com",
  "password": "123456"
}
```

### Response Esperada

```json
{
  "id": "uuid",
  "name": "Brian",
  "email": "brian@email.com"
}
```

---

## POST /auth/login

Responsável pela autenticação.

### Request

```json
{
  "email": "brian@email.com",
  "password": "123456"
}
```

### Response Esperada

```json
{
  "token": "jwt-token"
}
```

---

# Client Endpoints

## GET /clients

Lista todos os clientes do usuário autenticado.

### Segurança

* Requer JWT

---

## GET /clients/:id

Busca cliente específico.

### Segurança

* Requer JWT

---

## POST /clients

Cria um novo cliente.

### Request

```json
{
  "name": "Maria",
  "phone": "11999999999",
  "notes": "Cliente recorrente"
}
```

---

## PATCH /clients/:id

Atualiza cliente.

---

## DELETE /clients/:id

Remove cliente.

---

# Service Endpoints

## GET /services

Lista serviços do usuário.

---

## POST /services

Cria serviço.

### Request

```json
{
  "name": "Volume Brasileiro",
  "price": 150,
  "duration": 120
}
```

---

## PATCH /services/:id

Atualiza serviço.

---

## DELETE /services/:id

Remove serviço.

---

# Appointment Endpoints

## GET /appointments

Lista agendamentos.

---

## GET /appointments/:id

Busca agendamento específico.

---

## POST /appointments

Cria agendamento.

### Request

```json
{
  "clientId": "uuid-client",
  "serviceId": "uuid-service",
  "date": "2026-05-10T14:00:00.000Z",
  "duration": 120
}
```

### Regras

* cliente deve existir
* serviço deve existir
* usuário deve ser proprietário

---

## PATCH /appointments/:id

Atualiza agendamento.

---

## DELETE /appointments/:id

Remove agendamento.

---

# Dashboard Endpoints

## GET /dashboard

Retorna métricas gerais.

### Possíveis métricas

* quantidade de clientes
* quantidade de serviços
* total de agendamentos
* faturamento
* atendimentos recentes

---

# Fluxo de Autenticação

```txt
Usuário faz login
        ↓
AuthController recebe request
        ↓
AuthService valida credenciais
        ↓
JWT é gerado
        ↓
Frontend recebe token
        ↓
Rotas protegidas usam JwtGuard
```

---

# Fluxo de Agendamento

```txt
Cliente seleciona serviço
        ↓
AppointmentController recebe requisição
        ↓
AppointmentService valida disponibilidade
        ↓
Prisma grava agendamento
        ↓
Resposta retornada
```

---

# Segurança

## JWT

Autenticação baseada em token JWT.

## Guards

Rotas privadas protegidas utilizando `JwtGuard`.

## Recomendações Importantes

### Hash de senha

Atualmente o schema apenas define o campo `password`.

Recomendado:

```ts
bcrypt.hash(password, 10)
```

### Validação

Adicionar:

* class-validator
* ValidationPipe
* DTOs
* sanitização

### Segurança HTTP

Adicionar:

* helmet
* cors configurável
* rate limit
* proteção contra brute force

### Tokens

Melhorias sugeridas:

* Refresh Token
* expiração curta
* invalidação de sessão

---

# Melhorias Recomendadas

## Arquitetura

* DTOs separados
* camada de repositories
* tratamento global de exceções
* logs estruturados
* configuração por ambiente

---

## Segurança

* Refresh Token
* Rate Limiting
* Helmet
* Hash de senha com bcrypt
* RBAC

---

## DevOps

* Docker
* Docker Compose
* CI/CD
* Health Check
* Observabilidade
* Logs centralizados

---

## Qualidade

* Testes unitários
* Testes E2E
* Swagger
* ESLint
* Husky
* Conventional Commits

---

# Sugestão de Estrutura Enterprise

```txt
src/
├── modules/
├── shared/
├── config/
├── common/
├── database/
├── infra/
├── providers/
├── utils/
└── main.ts
```

---

# Variáveis de Ambiente

Arquivo:

```txt
.env
```

Exemplo esperado:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

# Frontend Integrado

O frontend utiliza React + Vite.

## Principais Bibliotecas

| Biblioteca   | Finalidade              |
| ------------ | ----------------------- |
| React        | Interface               |
| Vite         | Build e desenvolvimento |
| Axios        | Comunicação HTTP        |
| FullCalendar | Calendário/agendamentos |
| Recharts     | Dashboards e gráficos   |

## Possível Fluxo Frontend

```txt
Frontend React
      ↓
Axios
      ↓
NestJS API
      ↓
Prisma
      ↓
PostgreSQL
```

---

# Scripts Esperados

## Desenvolvimento

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm run start:prod
```

## Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

---

# Análise Técnica dos Services

## AppointmentService

### Pontos Fortes

* Validação de conflito de horários
* Proteção por `userId`
* Includes otimizados
* Ordenação por data
* Tratamento de exceções
* Regra de duração padrão

### Regra de Conflito

O sistema valida colisão de horários:

```txt
Novo horário não pode sobrepor
outro atendimento existente.
```

### Algoritmo Atual

```txt
Busca possíveis conflitos
        ↓
Calcula horário final
        ↓
Verifica interseção temporal
```

### Complexidade

A implementação atual está boa para MVP e pequenas cargas.

Para escala maior:

* índice por date
* filtro por range otimizado
* validação SQL mais performática
* Redis cache

### Melhorias Recomendadas

#### Status tipado

Atualmente:

```ts
status: string
```

Recomendado:

```ts
enum AppointmentStatus {
  scheduled,
  confirmed,
  canceled,
  completed
}
```

#### Transações

Usar Prisma Transaction:

```ts
this.prisma.$transaction()
```

#### Timezone

Adicionar padronização UTC.

---

## AuthService

### Pontos Fortes

* Hash seguro com bcrypt
* JWT funcional
* Verificação de usuário duplicado
* Tratamento de credenciais inválidas
* Separação correta de autenticação

### Segurança Atual

#### Hash

```ts
bcrypt.hash(password, 10)
```

Boa prática adequada.

#### JWT

Payload atual:

```ts
{
  sub,
  email,
  name
}
```

### Melhorias Recomendadas

#### Refresh Token

Implementar:

* access token curto
* refresh token
* logout invalidando sessão

#### Rate Limiting

Proteção contra brute force:

```txt
/login
/register
```

#### Validação de Email

Adicionar validação formal.

---

## ClientService

### Pontos Fortes

* Separação simples
* Escopo por usuário
* Ordenação de clientes

### Observação Técnica

A camada de atualização/remoção pode evoluir com validações adicionais de ownership diretamente nas operações finais.

Essa melhoria aumentará ainda mais a segurança e consistência da aplicação.

### Exemplo recomendado

```ts
where: {
  id,
  userId
}
```

---

## DashboardService

### Pontos Fortes

* Uso de Promise.all
* Dashboard agregando métricas
* Receita diária
* Receita mensal
* Serviços mais usados
* Estatísticas de 7 dias

### Considerações de Escalabilidade

Atualmente:

```txt
Busca todos os appointments
na memória.
```

Para cenários de crescimento elevado, recomenda-se mover parte das agregações diretamente para queries otimizadas no banco.

### Melhorias Recomendadas

#### Agregações SQL

Mover cálculos para banco:

* SUM
* COUNT
* GROUP BY

#### Cache

Adicionar:

* Redis
* cache de dashboard
* invalidação por evento

#### Queries Otimizadas

Separar:

* métricas rápidas
* métricas históricas
* gráficos

---

## ServiceService

### Pontos Fortes

* Validações de preço
* Conversão numérica
* Escopo por usuário
* Tratamento de inexistência

### Melhorias Recomendadas

#### Validação de duração

Adicionar:

```ts
if(duration <= 0)
```

#### Soft Delete

Evitar remoção física.

Exemplo:

```ts
deletedAt: DateTime?
```

---

# Diferenciais Técnicos do Projeto

## Funcionalidades Reais de Negócio

O sistema já implementa:

* autenticação JWT
* gerenciamento de clientes
* gerenciamento de serviços
* agendamentos
* prevenção de conflito de horários
* dashboard analítico
* controle multiusuário
* métricas financeiras

---

## Boas Práticas Aplicadas

* separação por domínio
* arquitetura modular
* uso de ORM moderno
* tratamento de exceções
* isolamento de dados por usuário
* organização consistente de services/controllers

---

# Qualidade Arquitetural Geral

## Nível Atual do Projeto

O projeto já demonstra:

* arquitetura modular
* domínio separado
* autenticação JWT
* ORM moderno
* controle de acesso
* regras de negócio reais
* tratamento de exceções
* organização consistente

Isso já ultrapassa muitos projetos CRUD básicos.

---

## Pontos Mais Fortes do Projeto

### 1. Separação por Domínio

Boa organização:

```txt
appointment/
auth/
client/
dashboard/
service/
```

---

### 2. Controle Multiusuário

O uso de:

```ts
userId
```

em praticamente todas queries mostra isolamento de dados.

---

### 3. Dashboard Real

O dashboard não é apenas CRUD.

Existe:

* métricas
* faturamento
* agregações
* analytics

---

### 4. Regra de Agenda

A lógica de conflito de horários é um diferencial importante.

---

# Evoluções Técnicas Planejadas

O projeto possui uma base sólida e preparada para evolução contínua.

## Melhorias Futuras

### Tipagem Forte

Planejado:

* DTOs
* ValidationPipe
* interfaces tipadas
* validação centralizada

---

### Documentação

Planejado:

* Swagger/OpenAPI
* documentação automática
* exemplos completos de requests/responses

---

### Segurança

Planejado:

* Refresh Tokens
* Rate Limiting
* validação avançada
* proteção adicional HTTP

---

### Escalabilidade

Planejado:

* cache Redis
* otimização de queries
* paginação
* observabilidade
* logs estruturados

---

### DevOps

Planejado:

* Docker
* CI/CD
* monitoramento
* health checks

---

# Melhorias Arquiteturais Recomendadas

## DTOs

Criar DTOs separados:

```txt
create-client.dto.ts
update-client.dto.ts
create-appointment.dto.ts
```

## Estrutura Enterprise

```txt
src/
├── modules/
├── shared/
├── common/
├── config/
├── database/
├── infra/
├── providers/
├── utils/
└── main.ts
```

## Swagger

Adicionar documentação automática:

```ts
SwaggerModule.setup('docs', app, document)
```

## Logs

Adicionar:

* Winston
* Pino
* request tracking
* correlation id

## Testes

Adicionar:

* Jest
* testes unitários
* testes E2E
* cobertura

## Docker

Adicionar:

* Dockerfile
* docker-compose
* ambiente PostgreSQL
* variáveis de ambiente

---

# Escalabilidade

A arquitetura atual permite evolução para:

* multi-tenant
* microsserviços
* filas
* notificações
* pagamentos
* auditoria
* dashboards avançados

---

# Conclusão

O projeto possui uma boa base modular utilizando NestJS + Prisma.

A estrutura atual já segue conceitos modernos de backend:

* separação por domínio
* services desacoplados
* autenticação JWT
* ORM moderno
* modularização

Com evolução da arquitetura, documentação, testes e DevOps, o sistema pode crescer para um padrão profissional enterprise/SaaS.