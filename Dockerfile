FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run prisma:generate

EXPOSE 3000

CMD [ "npm", "run","start:dev" ]
