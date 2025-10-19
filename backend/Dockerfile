FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p logs

EXPOSE 4000

CMD ["npm", "run", "dev"]
