FROM node:15

WORKDIR /discord-bot

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "start"]