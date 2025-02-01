FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build user-service

EXPOSE 3001

CMD ["npm", "run", "start:user-service"]
