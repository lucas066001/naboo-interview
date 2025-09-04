# Naboo interview

## What's used ?

backend

- mongodb
- nestjs
- mongoose
- data mapper pattern
- graphql

frontend

- nextjs (with page router)
- mantine-ui
- axios
- vitest
- graphql
- apollo client

## How to configure database ?

Create an .env file base on given .env.dist.
**Warning**: Your `MONGO_URI` contains database credentials and they should be the same as your launching command used in _How to launch project | database_ section. 

## How to launch project ?

database

```bash
docker run -d \
  --name mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -p 27017:27017 mongo
```

backend

```bash
npm i

npm run start:dev
```

frontend

```bash
npm i

npm run dev
```

after graphql modification

```bash
# > frontend
npm run generate-types
```

## Connection informations

email: user1@test.fr
password: user1
