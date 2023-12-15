# Stage 1: Build the Node.js application
FROM node:alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci && npm rebuild --verbose sharp  # Separating commands with &&

COPY . .

# Stage 2: Final image with ARM64 base
FROM arm64v8/ubuntu:latest

# Install necessary dependencies
RUN apt-get update \
    && apt-get install -y gnupg curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs 

WORKDIR /usr/src/app

# Copy the built application from the previous stage
COPY --from=build /usr/src/app .

CMD ["node", "app.js"]
