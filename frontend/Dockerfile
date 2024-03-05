FROM fedora:39 AS builder

# update and install yarn+quasar
RUN dnf update -y \
  && dnf install -y yarnpkg \
  && yarn global add @quasar/cli @quasar/icongenie

# copy in checkout of project src and build
WORKDIR /build
COPY . .
RUN yarn install && quasar b

FROM nginx:latest

LABEL maintainer="Nick Boughton <nb5@sanger.ac.uk>"

COPY --from=builder /build/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

