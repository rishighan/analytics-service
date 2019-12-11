FROM node:current-alpine

ENV NODE_ENV=production

RUN mkdir /analytics-service
WORKDIR /analytics-service

COPY package.json package-lock.json ./
RUN npm install --production 

COPY . .

RUN adduser -D myuser
USER myuser
EXPOSE 3000
CMD ["npm", "start"]