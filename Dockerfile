# First build
FROM node:10.16.3-alpine AS build

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git busybox-extras && \
  npm install --quiet node-gyp -g
  
RUN npm install -g node-gyp typescript

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN npm i
ADD . .
RUN npm run build 

# Second build
FROM node:10.16.3-alpine
ENV NODE_ENV production
WORKDIR /app
EXPOSE 9000
COPY --from=build /app /app
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && npm start
