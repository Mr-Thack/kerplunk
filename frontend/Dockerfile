# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node AS Compiler
COPY ./package*.json .
RUN npm install
COPY . .
# Clear Cache every dependency update!
RUN npm run build

FROM rtsp/lighttpd AS Proxy
COPY ./lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY --from=Compiler ./build/ /srv/http/
