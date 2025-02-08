FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build auth-microservice

CMD ["npm", "run", "start:auth-microservice"]
