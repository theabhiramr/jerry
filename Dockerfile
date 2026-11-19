FROM node:26-alpine AS base
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./

FROM base AS dev
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "--watch", "server.mjs"]

FROM base AS prod
ENV NODE_ENV=production
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci --omit=dev
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "server.mjs"]
