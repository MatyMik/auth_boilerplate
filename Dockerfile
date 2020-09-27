FROM node:latest

# copy webapp manifest files
#WORKDIR /app/

COPY .package.json ./

# install node dependencies and make
RUN npm install

CMD ["npm", "run", "dev"]