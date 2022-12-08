FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY routes ./routes
COPY models ./models
COPY app.js .

EXPOSE 3000

CMD npm start