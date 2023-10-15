## Prerequisites
- Download ton-storage tools for your OS - `wget https://github.com/ton-blockchain/ton/releases/download/v2023.06/ton-linux-x86_64.zip`
- Download global config - `wget https://ton-blockchain.github.io/global.config.json`
- `unzip ton-linux-x86_64.zip`
- Run daemon - `./storage-daemon -v 3 -C global.config.json -I <external_ip>:3333 -p 5555 -D storage-db`
- Make sure that port **5555** is open

## How to run the service
- Specify following env vars:
  ```
  #/root is the folder with ton-cli
  STORAGE_CLI_EXEC_PATH=/root/storage-daemon-cli
  STORAGE_WORK_DIR=/root
  #Should be true for linux and false for win
  USE_SHELL=true
  ```
- `npm run start`
