FROM node

EXPOSE 8080

RUN apt-get update -q \
  && apt-get install -yq netcat

# add user
ENV APP_USER es-bueno
RUN useradd -ms /bin/bash $APP_USER

# add app dir
ENV APP_DIR /home/$APP_USER/app
RUN mkdir $APP_DIR
WORKDIR $APP_DIR
COPY ./app $APP_DIR

# add log dir
RUN mkdir ./log

# build app
RUN npm install --silent \
  && npm run typings install --silent \
  && npm run build --silent

RUN chown -R $APP_USER:$APP_USER $APP_DIR
USER $APP_USER
CMD ["node", "--no-deprecation", "./dist/index.js"]
