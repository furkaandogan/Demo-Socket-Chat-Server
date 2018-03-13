FROM node:6.12.0 AS build-env

WORKDIR /app

COPY  . .

RUN npm install --only=dev 
RUN npm install gulp -g
RUN gulp build

FROM node:6.12.0

WORKDIR /app

RUN npm install

COPY --from=build-env /app .

EXPOSE 80

CMD [ "npm","start" ]

