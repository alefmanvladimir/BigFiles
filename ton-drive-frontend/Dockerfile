FROM node:18.12.1 as build

COPY ./ /source/

WORKDIR /source

RUN npm install

RUN npm run build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /source/dist /usr/share/nginx/html