FROM node:6-slim AS build-env

WORKDIR /app

COPY  . .

RUN npm install
RUN npm install gulp -g
RUN gulp build

FROM node:6-slim

WORKDIR /app

COPY --from=build-env /app .

EXPOSE 80

CMD [ "npm","start" ]

