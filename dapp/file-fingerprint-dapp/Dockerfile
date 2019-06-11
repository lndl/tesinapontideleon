FROM node:9.4.0-alpine

ARG reactappfileserverendpoint

ENV REACT_APP_FILESERVER_ENDPOINT $reactappfileserverendpoint

ADD . /app
WORKDIR /app

RUN echo "Starting building dapp image with these envs values: " && \
    echo "REACT_APP_FILESERVER_ENDPOINT:  $REACT_APP_FILESERVER_ENDPOINT" && \
    apk add --no-cache git python make g++ && \
    npm install -g http-server && \
    yarn install && \
    yarn build && \
    rm -rf node_modules && \
    apk del git python make g++

WORKDIR /app/build

CMD ["hs"]
