FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/db/package.json packages/db/package.json
RUN pnpm install --filter @aquata/api... --frozen-lockfile=false

COPY tsconfig.base.json ./
COPY apps/api apps/api

EXPOSE 3300
CMD ["pnpm", "--filter", "@aquata/api", "dev"]
