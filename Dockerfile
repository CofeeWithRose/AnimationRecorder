FROM docker.io/node

# Create app directory
RUN mkdir -p /home/animation
WORKDIR /home/animation

# Bundle app source
COPY . /home/animation
RUN npm install
RUN npm i typescript
EXPOSE 80
EXPOSE 443
CMD npm run start > ./animation_log.log