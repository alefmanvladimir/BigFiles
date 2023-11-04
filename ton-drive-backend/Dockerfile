FROM bigfiles-base

EXPOSE 3000

ARG STORAGE_CLI_EXEC_PATH=./storage-daemon-cli
ARG STORAGE_WORK_DIR=/usr/ton-storage/
ARG USE_SHELL=false

RUN apk add --no-cache wget unzip

WORKDIR /temp/

# Download TON binaries
# TODO: automate versioning
RUN wget https://github.com/ton-blockchain/ton/releases/download/v2023.06/ton-linux-x86_64.zip

# Extract required files
RUN unzip ton-linux-x86_64.zip \
  && mkdir -p ${STORAGE_WORK_DIR} \
  && cp storage-daemon-cli ${STORAGE_WORK_DIR} \
  && rm -rf /temp

WORKDIR ${STORAGE_WORK_DIR}

# Allow CLI execution
RUN chmod +x storage-daemon-cli

WORKDIR /usr/src/base/ton-drive-backend

RUN ln -s /usr/src/base/ton-drive-backend /usr/src/app \
  && rm -rf /usr/src/base/ton-drive-frontend

# build server
RUN npm run build

# remove dev dependencies
RUN npm prune --production --worspace=ton-drive-backend

CMD ["npm", "run", "start:prod"]
