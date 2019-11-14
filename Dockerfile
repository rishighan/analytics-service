FROM node:current-alpine

ENV NODE_ENV=production

RUN mkdir /analytics-service
WORKDIR /analytics-service

COPY package.json package-lock.json ./
RUN npm install --production 

COPY . .

RUN adduser -D myuser
USER myuser
CMD ["npm", "start"]