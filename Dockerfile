FROM denoland/deno:ubuntu AS build
WORKDIR /app
COPY package.json ./
COPY deno.* ./
RUN deno install
COPY . .
RUN deno task build

FROM denoland/deno:alpine AS runtime
WORKDIR /home/deno
COPY --from=build /app/build /home/deno
RUN deno install
USER deno
EXPOSE 3000
CMD ["deno", "run", "-REN", "--allow-sys", "index.js"]
