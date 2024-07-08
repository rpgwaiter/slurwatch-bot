FROM docker.io/python:3-bookworm
WORKDIR /usr/src/app

# install system deps
RUN apt-get update && apt-get install -y ffmpeg bash gcc cmake && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ENV STT_MODEL=ggml-tiny.en.bin
ADD ./models ./models/

COPY ./src .
CMD [ "/usr/local/bin/python", "-u", "/usr/src/app/main.py" ]
