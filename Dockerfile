FROM node:7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

ENV NODE_ENV=prod
#ADD dump.sql /docker-entrypoint-initdb.d

EXPOSE 3015
CMD [ "node", "server.js" ]

