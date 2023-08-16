# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node AS Compiler
COPY ./package*.json .
RUN npm install
COPY ./*js* ./
COPY ./*ts* ./
COPY ./*src* ./
COPY ./static ./
COPY ./.* ./

# Clear Cache every dependency update!
RUN npm run build

FROM rtsp/lighttpd AS Proxy
RUN touch /var/log/lighttpd.log
RUN chown lighttpd:lighttpd /var/log/lighttpd.log
COPY ./proxy /etc/lighttpd/
COPY --from=Compiler ./build/ /srv/http/
