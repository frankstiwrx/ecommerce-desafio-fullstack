FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci

# Prisma: gerar cliente antes do build
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do código e builda
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
