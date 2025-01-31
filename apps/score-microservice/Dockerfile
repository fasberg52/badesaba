FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build score-microservice

EXPOSE 3004

CMD ["npm", "run", "start:score-microservice"]
