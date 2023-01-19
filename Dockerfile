FROM node:19-alpine

WORKDIR /opt/app
COPY . .
RUN npm ci

CMD [ "npm", "start" ]
