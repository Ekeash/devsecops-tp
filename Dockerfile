# Image de base ancienne volontairement (pour que Trivy detecte des CVE)
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
