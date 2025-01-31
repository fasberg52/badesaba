FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build api-gateway

EXPOSE 3000

CMD ["npm", "run", "start:api-gateway"]
