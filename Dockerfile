# Image corrigee : base recente et legere (au lieu de node:14).
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
