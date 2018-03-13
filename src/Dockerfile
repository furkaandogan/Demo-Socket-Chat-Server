FROM node:9.8.0-slim AS build-env

WORKDIR /app

COPY  . .

RUN npm install -g
RUN npm install gulp -g
RUN gulp build

FROM node:9.8.0-slim

WORKDIR /app

COPY --from=build-env /app .

RUN npm install --only=prod

EXPOSE 80

CMD [ "npm","start" ]

