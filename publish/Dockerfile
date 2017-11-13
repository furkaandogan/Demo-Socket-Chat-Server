FROM node:boron

WORKDIR /usr/dhchat 

ENV path /linux

COPY  $path .


EXPOSE 5858
EXPOSE 5859

# CMD [ "./scripts/start.sh"]
RUN npm install 
#--only=production
CMD [ "npm","start" ]