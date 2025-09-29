# 🛒 Projeto E-commerce (Backend + Frontend)

Aplicação completa de e-commerce, com **autenticação JWT**, **carrinho de compras**, **gerenciamento de produtos** e **modo administrador**.
O sistema é composto por backend em **NestJS + Prisma + PostgreSQL + Redis** e frontend em **React + Vite + TypeScript**.

---

## 🚀 Tecnologias

### Backend

- ⚡ [NestJS](https://nestjs.com/) — Framework Node.js
- 🗂️ [Prisma](https://www.prisma.io/) — ORM
- 🐘 [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
- 🚀 [Redis](https://redis.io/) — Cache
- 🔑 [JWT](https://jwt.io/) — Autenticação baseada em token

### Frontend

- ⚛️ [React](https://react.dev/) — Biblioteca para interfaces
- ⚡ [Vite](https://vitejs.dev/) — Build tool e servidor de desenvolvimento
- 🟦 [TypeScript](https://www.typescriptlang.org/) — Tipagem estática

### Infraestrutura

- 🐳 [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) — Contêineres e orquestração

---

## 📂 Estrutura do Projeto

```bash
ProjetoDesafioBackEnd/
│
├── ecommerce-api/         # Backend (NestJS + Prisma)
│   ├── prisma/            # Schema e migrations do Prisma
│   ├── src/               # Código-fonte do backend
│   └── Dockerfile
│
├── frontend/              # Frontend (React + Vite)
│   ├── src/               # Código-fonte do frontend
│   └── Dockerfile
│
├── docker-compose.yml     # Orquestração dos serviços
└── README.md              # Documentação principal
```

---

## ⚙️ Como Rodar Localmente (sem Docker)

**Pré-requisitos**

- Node.js 20+
- PostgreSQL instalado
- Redis instalado
- NPM ou Yarn

### Backend

```bash
cd ecommerce-api
npm install

# Configurar o .env com as credenciais do banco e Redis
# Exemplo:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public

# Criar tabelas
npx prisma migrate dev

# Iniciar servidor
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Como Rodar com Docker

**Pré-requisitos**

- Docker + Docker Compose

### Subir os serviços

```bash
docker compose up -d --build
```

### Parar os serviços

```bash
docker compose down
```

### Executar seed no banco

```bash
docker compose exec backend node prisma/seed.js
```

---

## 👥 Usuários de Exemplo

**Administrador**

- Email: `admin@example.com`
- Senha: `admin123`

**Usuário Comum**

- Email: `novo@example.com`
- Senha: `senha123`

---

## 📌 Funcionalidades

- ✅ Listagem de produtos com busca e paginação
- ✅ Página de detalhes do produto
- ✅ Carrinho de compras
- ✅ Login e criação de conta (com verificação de email)
- ✅ Perfil do usuário
- ✅ Painel de administrador para gerenciamento de produtos

---

## 📖 Documentação da API

Disponível via **Swagger** em:
👉 [http://localhost:3000/docs](http://localhost:3000/docs)

---
