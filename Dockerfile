FROM node:gallium-alpine3.11 as builder

# This hack is widely applied to avoid python printing issues in docker containers.
# See: https://github.com/Docker-Hub-frolvlad/docker-alpine-python3/pull/13
ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache python3 && \
  python3 -m ensurepip && \
  rm -r /usr/lib/python*/ensurepip && \
  pip3 install --upgrade pip setuptools && \
  rm -r /root/.cache


WORKDIR /home/node

COPY ./src /home/node/src/
COPY ./*.json /home/node/

RUN yarn install \
  && yarn build:prod

# # ---

FROM node:gallium-alpine3.11

ENV NODE_ENV deployment

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY ./config/ /home/node/config/

CMD ["node", "dist/src/main.js"]