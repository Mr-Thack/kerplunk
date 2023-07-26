# KerPlunk! (A Chatting App)  
Our greatest invention.

# API Documentation:
Go to ```http://localhost:8000/api/docs``` to access.

# Development Without Docker:

Backend: 
```
cd backend
npm run dev  // To run the frontend on http://localhost:5173/
```
Frontend:
```
cd frontend
uvicorn main:app  // To run the backend on http://localhost:8000/
```

# Clear DB Without Docker:
Delete the folder ```backend/data```.

# How To Run With Docker:
Run these commands as superuser using su.

# Development With Docker:

Backend Docker: 
```
docker build \
    -f Dockerfile.Dev-Backend \
    -t kerplunk-backend .

docker run \
    --rm -p 8000:8000 \
    --mount type=volume,src=kerplunk-db,target=/kerplunk/backend/data \
    --mount type=bind,src="$(pwd)",target=/kerplunk \
     kerplunk-backend
```

Frontend Docker: 
```
docker build \
    -f Dockerfile.Dev-Frontend \
    -t kerplunk-frontend .

docker run \
    --rm -itp 5173:5173 \
    --mount type=bind,src="$(pwd)",target=/kerplunk \
    kerplunk-frontend

# Site is at http://localhost:5173/.
```

# Production With Docker:
```
docker build -f Dockerfile.Prod -t kerplunk .

docker run \
    --rm -p 8000:8000 \
    --mount type=volume,src=kerplunk-db,target=/kerplunk/backend/data \
    kerplunk

# Site is at http://localhost:8000/.
```

# Stop All Running Docker Containers:
```
docker ps -aq | xargs docker stop | xargs docker rm
```

# Clear DB On Docker:
```
sudo rm -r /var/lib/docker/volumes/kerplunk-db/_data
sudo mkdir /var/lib/docker/volumes/kerplunk-db/_data
```
