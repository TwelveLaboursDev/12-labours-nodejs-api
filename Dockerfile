FROM --platform=linux/amd64 node:14.17.6-alpine

WORKDIR /12-labours-nodejs-api

COPY . .

RUN npm install

CMD ["npm", "start"]
