FROM node

EXPOSE 8080

# apt-transport-https is for apt-get update failing after adding deb sources
# RUN apt-get update -q \
#   && apt-get install -yq apt-transport-https \
#   && wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | apt-key add - \
#   && echo "deb https://packages.elastic.co/beats/apt stable main" | tee -a /etc/apt/sources.list.d/beats.list \
#   && apt-get update -q \
#   && apt-get install -yq netcat supervisor filebeat

# add user
ENV APP_USER es-bueno
ENV APP_DIR /home/$APP_USER/app
RUN useradd -ms /bin/bash $APP_USER
USER $APP_USER

# add app dir
RUN mkdir $APP_DIR
WORKDIR $APP_DIR
COPY ./app $APP_DIR

# add log dir
RUN mkdir ./log

# build app
RUN npm install \
  && npm run typings install \
  && npm run build

CMD ["node --no-deprecation", "./dist/index.js"]

# CMD ["supervisord", "-n"]
