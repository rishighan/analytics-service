FROM node:current-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
COPY .env ./ 
RUN npm install --production 

COPY . .

RUN adduser -D myuser
USER myuser
CMD ["npm", "start"]