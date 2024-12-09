FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apt update

WORKDIR /app
RUN pnpm install turbo@^2 --global
COPY . .
RUN turbo prune user-management --docker

FROM base AS installer
RUN apt update

WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install turbo@^2 --global
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm prisma:generate --filter=@solutions/shared-database
COPY ./packages/shared-database/prisma ./apps/user-management/prisma
RUN cp -r ./packages/shared-database/node_modules/@prisma/shared-database ./apps/user-management/node_modules/@prisma/shared-database
RUN pnpm build --filter=user-management

FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install curl -y

# Remove this if base changes to node:20-slim or higher
RUN set -xe && \
  apt-get install -y --no-install-recommends openssl && \
  apt-get autoremove -y && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /usr/share/man/* /usr/share/doc/*

COPY --from=installer /app .
RUN chmod ug+x /app/apps/user-management/scripts/server.sh

EXPOSE 8002

ENTRYPOINT ["/app/apps/user-management/scripts/server.sh"]
