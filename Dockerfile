FROM node:12-slim
ENV NODE_ENV production

# copy files
WORKDIR /usr/src/app

# copy webapp manifest files
COPY . .

# install node dependencies and make
RUN npm i --production=false

# build webapp and clean
RUN npm run build

CMD ["npm", "start"]