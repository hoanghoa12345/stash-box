FROM denoland/deno:alpine-2.1.4

WORKDIR /app

COPY ./functions .

WORKDIR /app/metatags-info

RUN deno cache ./index.ts

ENTRYPOINT [ "deno" ]

EXPOSE 8080

CMD [ "run", "--allow-all", "--watch", "--unstable", "index.ts" ]

