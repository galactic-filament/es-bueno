FROM node

EXPOSE 8080

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
RUN npm install --silent \
  && npm run typings install --silent \
  && npm run build --silent

CMD ["node", "--no-deprecation", "./dist/index.js"]
