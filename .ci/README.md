# BigFiles CI

This folder contains the main configuration files for the BigFiles CI.

## Manual configuration

Part of the configuration is done manually.

> **Note:** pay attention to manual configuration when updating the CI.

### Main NGINX proxy

Folder `.ci/nginx-proxy` contains the configuration for the main NGINX proxy with sertificates. It is built and run on the host machine manually. It watches for the new containers and automatically adds them to the proxy configuration.

If there are any changes in the configuration, the proxy should be restarted manually.

### Dotenv files

`.env` files are ignored by the git. These files are created manually on the host machine:

- `ton-drive-backend/.env`
- `ton-drive-frontend/.env`

If you want to change the configuration, you should change the `.env` files on the host machine.

> **Note:** if you want to add some `.env` file to the git, pay attention to how it will affect the CI.

## Automatic configuration

After the commit to the `master` branch, the CI automatically builds and runs the containers on the host machine. You can read more here:

- [`ton-drive-backend/docker-compose.yaml`](../ton-drive-backend/docker-compose.yaml)
- [`ton-drive-frontend/docker-compose.yml`](../ton-drive-frontend/docker-compose.yml)
