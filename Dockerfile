FROM denoland/deno:debian AS build
WORKDIR /app
COPY package.json ./
COPY deno.* ./
RUN deno install
COPY . .
RUN deno task build

FROM denoland/deno:alpine AS runtime
COPY --from=build /app/build /home/deno
USER deno
WORKDIR /home/deno
EXPOSE 3000
CMD ["deno", "run", "-REN", "--allow-sys", "index.js"]
