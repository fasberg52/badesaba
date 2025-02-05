FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

COPY ./scripts/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

RUN npm run build referral-service

EXPOSE 3003

EXPOSE 5672

CMD ["npm", "run", "start:referral-service"]
