FROM node:16-alpine
WORKDIR /app
COPY ["./server/package.json", "./"]
RUN npm i
COPY ./server ./
ENV NODE_ENV=production
RUN npm run build
COPY ./server/.env dist
EXPOSE 2022
CMD ["node", "--experimental-specifier-resolution=node", "dist/index.js"]