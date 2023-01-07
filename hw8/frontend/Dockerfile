FROM node:18 AS builder

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY vite.config.ts .
COPY ./src/ ./src/
COPY ./index.html .

RUN npx vite build

FROM ipfs/kubo:v0.17.0

COPY --from=builder /dist /frontend/app
COPY ./scripts/01-config.sh /container-init.d
