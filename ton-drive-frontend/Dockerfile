FROM bigfiles-base as build

WORKDIR /usr/src/base

RUN npm run build:frontend

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/base/ton-drive-frontend/dist /usr/share/nginx/html
