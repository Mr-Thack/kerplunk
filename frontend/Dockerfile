# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node AS Compiler
COPY ./package*.json .
RUN npm install
COPY .eslintignore .npmrc .prettierrc postcss.config.cjs tailwind.config.cjs vite.config.ts .eslintrc.cjs .prettierignore svelte.config.js tsconfig.json ./
COPY ./src ./src/
COPY ./src-tauri ./src-tauri/
COPY ./static ./static/

# Clear Cache every dependency update!
RUN npm run build

FROM nginx AS Proxy
RUN rm /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
COPY ./proxy /etc/nginx/
COPY --from=Compiler ./build/ /var/www/html
