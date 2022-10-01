FROM node:16

WORKDIR /code

COPY ./package.json /code/package.json
COPY ./package-lock.json /code/package-lock.json

RUN npm i

COPY ./app /code/app

ENV NODE_OPTIONS='-r @lumigo/opentelemetry'

CMD ["npm", "run", "start"]