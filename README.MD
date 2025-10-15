# 🛒 Projeto E-commerce (Backend + Frontend)

Aplicação completa de e-commerce, com **autenticação JWT**, **carrinho de compras**, **checkout de pedidos**, **gerenciamento de produtos** e **modo administrador**.
O sistema é composto por backend em **NestJS + Prisma + PostgreSQL + Redis** e frontend em **React + Vite + TypeScript**.

---

## 🚀 Tecnologias

### Backend

* ⚡ [NestJS](https://nestjs.com/) — Framework Node.js modular e escalável
* 🗂️ [Prisma](https://www.prisma.io/) — ORM para comunicação com o PostgreSQL
* 🐘 [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
* 🚀 [Redis](https://redis.io/) — Armazenamento em cache para sessões e validações
* 🔑 [JWT](https://jwt.io/) — Autenticação segura baseada em tokens

### Frontend

* ⚛️ [React](https://react.dev/) — Criação de interfaces dinâmicas
* ⚡ [Vite](https://vitejs.dev/) — Build tool rápida e moderna
* 🟦 [TypeScript](https://www.typescriptlang.org/) — Tipagem estática para maior confiabilidade

### Infraestrutura

* 🐳 [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) — Contêinerização e orquestração de serviços

---

## 📂 Estrutura do Projeto

```bash
ProjetoDesafioBackEnd/
│
├── ecommerce-api/          # Backend (NestJS + Prisma)
│   ├── prisma/             # Schema, migrations e seeds do Prisma
│   ├── src/                # Código-fonte do backend
│   └── Dockerfile
│
├── frontend/               # Frontend (React + Vite)
│   ├── src/                # Código-fonte do frontend
│   └── Dockerfile
│
├── docker-compose.yml      # Orquestração dos serviços (DB, Redis, API, Frontend)
└── README.md               # Documentação principal
```

---

## ⚙️ Como Rodar Localmente (sem Docker)

**Pré-requisitos**

* Node.js 20+
* PostgreSQL instalado
* Redis instalado
* NPM ou Yarn

### Backend

```bash
cd ecommerce-api
npm install

# Configurar o .env com as credenciais do banco e Redis
# Exemplo:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public

# Criar tabelas
npx prisma migrate dev

# Rodar servidor
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Como Rodar com Docker

**Pré-requisitos**

* Docker
* Docker Compose

### Subir o projeto

```bash
docker compose up -d --build
```

### Parar o projeto

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

* Email: `admin@example.com`
* Senha: `admin123`

**Usuário Comum**

* Email: `novo@example.com`
* Senha: `senha123`

---

## 📌 Funcionalidades

* ✅ Listagem de produtos com busca e paginação
* ✅ Página de detalhes do produto
* ✅ Carrinho de compras com controle de estoque
* ✅ Checkout de pedidos (Order e OrderItem)
* ✅ Desconto automático de estoque ao finalizar compra
* ✅ Login e criação de conta (com verificação de email)
* ✅ Perfil do usuário
* ✅ Painel de administrador para gerenciamento de produtos

---

## 📦 Modelagem de Dados (Principais Entidades)

* **User** → armazena dados de autenticação e role (USER ou ADMIN)
* **Product** → produtos com preço, descrição, imagem e estoque
* **Cart / CartItem** → estrutura de carrinho vinculada ao usuário
* **Order / OrderItem** → pedidos gerados no checkout, com status e valor total
* **EmailVerificationToken** → confirmações de email pendentes

---

## 📖 Documentação da API

A documentação Swagger está disponível em:
👉 [http://localhost:3000/docs](http://localhost:3000/docs)

## Vídeo Ilustrativo disponível em:
👉 https://youtu.be/TLwIQu_boGo


