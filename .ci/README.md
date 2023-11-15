# BigFiles CI

This folder contains the main configuration files for the BigFiles CI.

## Manual configuration

Part of the configuration is done manually.

> **Note:** pay attention to manual configuration when updating the CI.

### Generate keygen in local machine
In your local machine, execute the following command in the terminal and generate your ssh-keygen.

> ssh-keygen -f ~/.ssh/yourhost -t ed25519 -b 4096 -C "youremail@example.com"

**Copy our public key to the remote server’s authorize**
> ### goto remote server
> echo "your public keygen content" >> .ssh/authorized_keys

**Copy our Private Key and paste it into Github Secrets.**
> **Note:** Go to “Settings” > “Secrets”, and click “New repository secret” button.

> **HOST:** your host address **KEY_ED25519:** past your private keygen content **PORT:** your ssh port, default is 22 **USERNAME:** your ssh login username

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
