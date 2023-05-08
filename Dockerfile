FROM node:lts-slim

RUN mkdir -p /q-system-next

RUN apt-get update
RUN apt-get install -y unzip wget busybox-static

COPY . /q-system-next
WORKDIR ./q-system-next

RUN wget https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip
RUN unzip awscli-exe-linux-x86_64.zip
RUN aws/install

RUN npm install

RUN chmod +x ./run.sh
CMD ./run.sh

