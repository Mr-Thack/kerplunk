# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node AS compiler
COPY package*.json ./
RUN npm install
ARG CACHEBUST=1
COPY . .
# Clear Cache every dependency update!
RUN npm install
RUN npm run build

FROM rtsp/lighttpd
COPY --from=compiler ./build/ /srv/http/
COPY ./lighttpd.conf /etc/lighttpd.conf
