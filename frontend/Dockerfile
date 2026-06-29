FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NITRO_PRESET=node-server
ENV HOST=0.0.0.0
ENV PORT=3000

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]