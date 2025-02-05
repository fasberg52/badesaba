FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build auth-service

EXPOSE 3002

EXPOSE 5672

CMD ["npm", "run", "start:auth-service"]
