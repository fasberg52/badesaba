FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build spinner-microservice

EXPOSE 3005

CMD ["npm", "run", "start:spinner-microservice"]
