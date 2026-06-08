FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --filter @aquata/web... --frozen-lockfile=false

COPY tsconfig.base.json ./
COPY apps/web apps/web

EXPOSE 5174
CMD ["pnpm", "--filter", "@aquata/web", "dev"]
