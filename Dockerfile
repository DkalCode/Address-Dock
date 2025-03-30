ARG NODE_VERSION=20.13.1
ARG SERVER_PORT=3000

FROM node:${NODE_VERSION}-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json .

RUN npm install --only=production

COPY . .

EXPOSE ${SERVER_PORT}

CMD ["node", "src/server.js"]