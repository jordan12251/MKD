FROM node:lts-buster

# Installer les dépendances nécessaires
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  libwebp-tools && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json .

# Installer les dépendances Node
RUN npm install && npm install -g qrcode-terminal pm2

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
