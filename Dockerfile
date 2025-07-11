FROM node:alpine
RUN mkdir -p /miru
WORKDIR /miru
ENV NODE_PATH=/usr/local/lib/node_modules
COPY package.json /miru
RUN npm install
COPY . /miru
ENV NODE_PATH=/usr/local/lib/node_modules
LABEL name="miru" version="5.0"
CMD ["node" ,"."]