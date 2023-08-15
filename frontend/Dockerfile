# syntax=docker/dockerfile:1

# First, we'll build the frontend into static HTML
FROM node AS compiler
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Move the build files from RAM into storage
RUN cp ./build/ /srv/http/
RUN echo $(ls /srv/http)
