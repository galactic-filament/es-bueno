FROM node

EXPOSE 80
ENV APP_PORT 80

# add app dir
ENV APP_DIR /srv/app
RUN mkdir $APP_DIR
WORKDIR $APP_DIR
COPY ./app $APP_DIR

# add log dir
RUN mkdir ./log

# build app
RUN npm install -s \
  && npm run -s typings install \
  && npm run -s build

CMD ["./bin/run-app"]
