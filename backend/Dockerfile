# syntax=docker/dockerfile:1
   
FROM python:3.10 AS backend
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 8000
WORKDIR /root
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
ARG ISPRODUCTION=True
# Caching stops here
COPY . .
WORKDIR ./api
CMD ["python3", "-m", "gunicorn", "main:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]