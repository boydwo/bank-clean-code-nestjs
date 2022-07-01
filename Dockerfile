FROM node:14-alpine


WORKDIR /app

COPY package.json package-lock.json ./
COPY package.json ./
# COPY .env ./

RUN npm install

COPY . .

# RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run","start:dev" ]
