# syntax=docker/dockerfile:1
   
FROM python:3.10 as backend-executor
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY . /root/
WORKDIR /root
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
WORKDIR ./api
ARG ISPRODUCTION=True
CMD ["python3", "-m", "gunicorn", "main:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]