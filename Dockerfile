FROM node:alpine

WORKDIR /crm-api

COPY package.json ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["yarn","start"]
