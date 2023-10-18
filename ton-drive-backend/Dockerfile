# storage daemon builder
FROM ubuntu:20.04 as storage_daemon_builder
RUN apt-get update && \
 DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential cmake clang-6.0 openssl libssl-dev zlib1g-dev gperf wget git ninja-build && \
 rm -rf /var/lib/apt/lists/*

ARG TON_REPO
RUN git clone --recursive ${TON_REPO:-https://github.com/ton-blockchain/ton} /ton
WORKDIR /ton
ARG TON_BRANCH
RUN git checkout ${TON_BRANCH:-master}

ENV CC clang-6.0
ENV CXX clang++-6.0
ENV CCACHE_DISABLE 1
RUN mkdir build && \
 cd build && \
 cmake -GNinja -DCMAKE_BUILD_TYPE=Release .. && \
 ninja storage-daemon storage-daemon-cli

# main
FROM node:20-alpine

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

# add storage daemon binaries
# TODO: run storage daemon
COPY --from=storage_daemon_builder /ton/build/storage/storage-daemon/storage-daemon-cli /usr/local/bin/
COPY --from=storage_daemon_builder /ton/build/storage/storage-daemon/storage-daemon /usr/local/bin/

CMD ["npm","start"]
