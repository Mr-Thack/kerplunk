# Kerplunk
Yes. We will run it.

# API Documentation:
go to ```http://localhost:8000/api/docs```

# Development without Docker:
```
cd backend
npm run dev  // To run the frontend on http://localhost:5173/

cd frontend
uvicorn main:app  // To run the backend on http://localhost:8000/
```

# Clear DB without Docker:
Delete the folder ```backend/data```.

# How to run with Docker
Run these commands as superuser using su

# Development with Docker
```

docker build \
    -f Dockerfile.Dev-Backend \
    -t kerplunk-backend .

docker build \
    -f Dockerfile.Dev-Frontend \
    -t kerplunk-frontend .

docker run \
    --rm -p 8000:8000 \
    --mount type=volume,src=kerplunk-db,target=/kerplunk/backend/data \
    --mount type=bind,src="$(pwd)",target=/kerplunk \
     kerplunk-backend

docker run \
    --rm -itp 5173:5173 \
    --mount type=bind,src="$(pwd)",target=/kerplunk \
    kerplunk-frontend

# Site is at http://localhost:5173/
```

# Production with Docker:
```
docker build -f Dockerfile.Prod -t kerplunk .

docker run \
    --rm -p 8000:8000 \
    --mount type=volume,src=kerplunk-db,target=/kerplunk/backend/data \
    kerplunk

# Site is at http://localhost:8000/
```

# Stop all running Docker containers:
```
docker ps -aq | xargs docker stop | xargs docker rm
```

# Clear DB on Docker
```
sudo rm -r /var/lib/docker/volumes/kerplunk-db/_data
sudo mkdir /var/lib/docker/volumes/kerplunk-db/_data
```
