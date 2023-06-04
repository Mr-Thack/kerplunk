# Kerplunk
This is probably doomed.
Download the code and sleep well.

# How to run
Run these commands as superuser using su

# Development:
```

docker build \
    -f Dockerfile.Dev-Backend \
    -t kerplunk-backend .

docker build \
    -f Dockerfile.Dev-Frontend \
    -t kerplunk-frontend .

docker run \
    --rm -dp 8000:8000 \
    --mount type=volume,src=kerplunk-db,target=/kerplunk/backend/data \
    --mount type=bind,src="$(pwd)",target=/kerplunk \
     kerplunk-backend

docker run \
    --rm -p 5173:5173 \
    --mount type=bind,src="$(pwd)",target=/kerplunk \
     kerplunk-frontend

# Site is at http://localhost:5173/
```

# Production:
```
docker build -f Dockerfile.Prod -t kerplunk .

docker run \
    --rm -p 8000:8000 \
    --mount type=volume,src=kerplunk-db,target=/kerplunk/backend/data \
    kerplunk

# Site is at http://localhost:8000/
```

# Stop all running containers:
```
docker ps -aq | xargs docker stop | xargs docker rm
```