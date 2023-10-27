 #!/bin/bash
cd ton-drive-backend
docker-compose down && docker builder prune -a -f && docker-compose up -d --build
cd .. && cd ton-drive-frontend
docker-compose down && docker builder prune -a -f && docker-compose up -d --build