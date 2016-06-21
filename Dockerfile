FROM node

EXPOSE 80

# apt-transport-https is for apt-get update failing after adding deb sources
RUN apt-get update -q \
  && apt-get install -yq apt-transport-https \
  && wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | apt-key add - \
  && echo "deb https://packages.elastic.co/beats/apt stable main" | tee -a /etc/apt/sources.list.d/beats.list \
  && apt-get update -q \
  && apt-get install -yq netcat supervisor filebeat

COPY ./app /srv/app
WORKDIR /srv/app
RUN npm install --silent
ENV REQUEST_LOGGING 1

COPY ./container/files/ /

CMD ["supervisord", "-n"]
