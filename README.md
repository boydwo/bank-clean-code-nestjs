## Description

The goal of this test is to develop a REST API in NodeJS with Nest.js that simulates a banking system.

These are the endpoints that you should include:

1. Create account;
2. Make a deposit;
3. Get account balance;
4. Get account statement;
5. Transfer amount between two accounts;
6. Make a withdrawal;

# Getting started (1 min)

Make sure to have docker installed, otherwise [install it here](https://docs.docker.com/get-docker/).

1. Clone the project

```
git clone https://github.com/boydwo/bank-clean-code-nestjs.git
```

2. Fetch dependencies

```
npm install
```

3. Copy the `.env.example` file over to your own `.env` file.

4. Mount docker container and start server

```
docker-compose up
```

5. Running migrations

```
npx prisma migrate dev
```

6. Open the Swagger Documentation on http://localhost:3000/docs

7. Run unit tests

```
npm run test:unit
```

8.  Run e2e tests

```
npm run test:e2e
```
