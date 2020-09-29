FROM node:latest


COPY package.json ./

# install node dependencies and make
RUN npm install

CMD ["npm", "run", "dev"]