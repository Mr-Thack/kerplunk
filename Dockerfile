# syntax=docker/dockerfile:1


# Open Lighttpd
FROM rtsp/lighttpd
# Move the build files from RAM into storage
VOLUME /srv/http
COPY ./lighttpd.conf /etc/lighttpd/
