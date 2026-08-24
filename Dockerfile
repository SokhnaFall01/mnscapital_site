# =========================================================================
# MNS CAPITAL — Image Docker de l'application (Node.js / Express)
# =========================================================================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Installer d'abord les dépendances (meilleur cache Docker)
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le reste du code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
