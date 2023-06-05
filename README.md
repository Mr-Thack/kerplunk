# Kerplunk
"This is probably doomed." - Said no one ever...

Hey Abdul. This is a little inspiration for you. GA Tech is probably where you are heading to. You have big dreams of being a software engineer or developer I would imagine. You have everything given to you. You have worked so hard on this project preparing it 3 days before NCTC, and you have prepared for every standardized test like you mean it. You know what I am talking about, mainly the sleepness nights. I understand your dream, and it is very possible. Once everyone collaborates on this project, this will be the savior for our school. Just to let everyone know that I was out for a week because I had to go to India to attend my father's grandmother funeral, which is why you haven't heard from me recently. I came back to GA recently. 

In addition, I was thinking about a feature of where a blind person can use the buttons on their device to create a message in Morse Code, where it will be transformed into an audio file, where the person on the other side will hear it (who is also blind). It will be a good feature for our SPED kids in our school, since most of them have disablities. Just consider this please. Thanks for all the effort you have given to this project.

Hey Johnathan. Majority of things I said to Abdul applies to you to perhaps. You want to go to an Ivy League. This project will get you there. It will make all the difference in the world for our community. You made the UI much cleaner. The code will not stand where it is now without your expertise. Thanks for your input as well. I will be helping soon after I get my life back together. Thanks, again. 

Imagine yall are superstars in the programming scene. Never give up your dreams. 

Download the code, and have the best sleep of your life! ;)

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

# Clear DB
```
sudo rm -r /var/lib/docker/volumes/kerplunk-db/_data
sudo mkdir /var/lib/docker/volumes/kerplunk-db/_data
```
