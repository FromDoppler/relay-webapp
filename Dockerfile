FROM circleci/node:6-browsers AS restore
USER node
RUN mkdir -p /home/node/src
WORKDIR /home/node/src
COPY src/package.json src/yarn.lock src/bower.json src/.bowerrc ./
RUN yarn global add gulp && yarn

FROM restore as build
COPY --chown=node:node src .
ARG environment=development
RUN NODE_ENV=$environment yarn run build

FROM nginx:alpine AS final
COPY --from=build /home/node/src/build /usr/share/nginx/html
ARG version=unknown
RUN echo $version > /usr/share/nginx/html/version.txt
ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80
