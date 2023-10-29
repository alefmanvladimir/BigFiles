 #!/bin/bash
git pull --all
cd ton-drive-backend
docker-compose up --force-recreate --build -d
cd .. && cd ton-drive-frontend
docker-compose up --force-recreate --build -d
docker image prune -f
docker builder prune -f
docker system prune -f
