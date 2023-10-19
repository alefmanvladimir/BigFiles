FROM node:20-alpine

EXPOSE 3000

ARG STORAGE_CLI_EXEC_PATH=/usr/local/bin/storage-daemon-cli
ARG STORAGE_WORK_DIR=/
ARG USE_SHELL=false

RUN apk add --no-cache wget unzip

# Download TON binaries
# TODO: automate versioning
RUN wget https://github.com/ton-blockchain/ton/releases/download/v2023.06/ton-linux-x86_64.zip \
  && unzip ton-linux-x86_64.zip \
  && rm ton-linux-x86_64.zip \
  && cp storage-daemon-cli ${STORAGE_CLI_EXEC_PATH} \
  && chmod +x ${STORAGE_CLI_EXEC_PATH} \
  && rm -rf /temp

WORKDIR /usr/src/app

# install dependencies
COPY package.json ./
RUN npm install

# copy source code
COPY . .

# build server
RUN npm run build

# remove dev dependencies
RUN npm prune --production

CMD ["npm","start:prod"]
