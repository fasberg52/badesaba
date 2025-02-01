FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build referral-service

EXPOSE 3003

CMD ["npm", "run", "start:referral-service"]
