FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

COPY ./scripts/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

RUN npm run build user-service

EXPOSE 3001



CMD ["npm", "run", "start:user-service"]
