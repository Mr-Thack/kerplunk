# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node AS compiler
COPY . .
# Run build
RUN npm install && npm run build

# Open Lighttpd
FROM rtsp/lighttpd
# Move the build files from RAM into storage
COPY --from=compiler ./build/ /var/www/html/
COPY ./lighttpd.conf /etc/lighttpd/
