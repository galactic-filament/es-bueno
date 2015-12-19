FROM node

EXPOSE 80

RUN apt-get update -q \
  && apt-get install -yq netcat

COPY ./app /srv/app
WORKDIR /srv/app

RUN npm install --silent

CMD ["node", "index.js"]
