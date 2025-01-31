FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build auth-service

EXPOSE 3002

CMD ["npm", "run", "start:auth-service"]
