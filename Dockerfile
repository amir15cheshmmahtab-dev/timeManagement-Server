FROM node:21 as build-image
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm i
RUN npx tsc -p ./tsconfig.json
RUN npx tsc-alias

FROM node:21
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build-image ./usr/src/app/dist ./dist
RUN mkdir -p ./dist/.logs
RUN npm i --production
COPY . .
RUN npm install pm2 -g

EXPOSE 3060

CMD pm2-runtime process.yaml
