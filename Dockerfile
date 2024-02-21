FROM node:16-bookworm

WORKDIR /usr/src/app
COPY . .

RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

# -v //var/run/docker.sock:/var/run/docker.sock