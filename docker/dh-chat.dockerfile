FROM node:6.12.0-alpine

WORKDIR /usr/dhchat 

ENV path /linux

COPY  $path .

RUN chmod +x ./scripts/start.sh

RUN npm install 

EXPOSE 5858
EXPOSE 5859

# ENTRYPOINT ["./scripts/start.sh"]
CMD [ "npm","start" ]