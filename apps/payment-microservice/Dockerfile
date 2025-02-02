FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build payment-microservice

EXPOSE 3006

CMD ["npm", "run", "start:payment-microservice"]
