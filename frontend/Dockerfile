# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node
COPY . .
# Run build
RUN npm install && npm run build

# Move the build files from RAM into storage
VOLUME /srv/http
RUN cp ./build/ /srv/http/
RUN echo $(ls /srv/http)
