# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM docker.io/oven/bun:debian
WORKDIR /usr/src/app

COPY package.json bun.lockb /usr/src/app/
RUN bun install --frozen-lockfile --production

COPY . .
USER root
ENTRYPOINT [ "bun", "start" ]
# ENTRYPOINT [ "/bin/sh" ]

# install dependencies into temp directory
# this will cache them and speed up future builds

# RUN mkdir -p /temp/dev
# COPY package.json bun.lockb /temp/dev/
# RUN cd /temp/dev && bun install --frozen-lockfile

# # install with --production (exclude devDependencies)
# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile 

# # copy node_modules from temp directory
# # then copy all (non-ignored) project files into the image
# FROM base AS release
# COPY --from=install /temp/dev/node_modules node_modules
# COPY . .

# # copy production dependencies and source code into final image
# COPY --from=install /temp/prod/node_modules node_modules

# run the app
# EXPOSE 3000/tcp
# ENTRYPOINT [ "bun", "start" ]