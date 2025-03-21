ARG NODE_VERSION=20.13.1
ARG SERVER_PORT=3000

FROM node:${NODE_VERSION}-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:${NODE_VERSION}-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json .

RUN npm install --only=production

COPY --from=build /app/dist/ ./dist/

EXPOSE ${SERVER_PORT}

CMD ["node", "dist/server.js"]