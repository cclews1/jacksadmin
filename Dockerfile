FROM node:14
WORKDIR /app

RUN npm i pm2 -g

COPY ./package*.json ./

RUN npm i

COPY . ./

RUN npm run build

EXPOSE 5000

CMD ["pm2-runtime", "start", "app.config.json"]