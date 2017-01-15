FROM node

EXPOSE 80
ENV APP_PORT 80

RUN apt-get update -q \
  && apt-get install -yq netcat

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

CMD ["node", "--no-deprecation", "./dist/index.js"]
