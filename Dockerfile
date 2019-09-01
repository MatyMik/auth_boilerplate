# First build
FROM node:latest AS build

WORKDIR /app
ARG NPM_TOKEN

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN npm ci
ADD . .

#RUN npm test
RUN npm run build

EXPOSE 9000
CMD ["npm", "start"]
