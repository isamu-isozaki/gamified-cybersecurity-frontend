FROM node:18-bookworm

WORKDIR /usr/src/app
COPY . .

ENV BACKEND_HOST backend

RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["npm", "run", "serve"]

# -v //var/run/docker.sock:/var/run/docker.sock
