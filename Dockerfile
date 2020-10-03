FROM node:latest

COPY package.json nodemon.json tsconfig.json ./

# install node dependencies and make
RUN npm install

CMD ["npm", "run", "dev"]