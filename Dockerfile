FROM node:latest AS build
ENV NODE_ENV production

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN npm ci
ADD . .

RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]