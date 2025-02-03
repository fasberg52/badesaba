FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

COPY ./scripts/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

RUN npm run build spinner-microservice

EXPOSE 3005

CMD ["npm", "run", "start:spinner-microservice"]
