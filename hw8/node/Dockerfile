FROM node:18

WORKDIR app

COPY package.json .
COPY package-lock.json .
RUN npm i

COPY hardhat.config.ts .
COPY scripts/ ./scripts
COPY contracts/ ./contracts

ENTRYPOINT ["bash", "./scripts/start.sh"]