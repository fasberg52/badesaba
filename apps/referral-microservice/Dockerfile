FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build referral-microservice

CMD ["npm", "run", "start:referral-microservice"]
