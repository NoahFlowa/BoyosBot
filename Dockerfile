FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add libsodium libsodium-dev build-base libtool make autoconf automake python3 bash
RUN npm install
COPY . .
EXPOSE 443
CMD [ "node", "." ]
