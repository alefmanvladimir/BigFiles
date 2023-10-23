FROM node:18.12.1 as build

RUN apt update && apt install git

RUN git clone -b main https://github.com/alefmanvladimir/TON-Drive.git

WORKDIR /TON-Drive/ton-drive-frontend

RUN npm install

RUN npm run build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /TON-Drive/ton-drive-frontend/dist /usr/share/nginx/html