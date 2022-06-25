FROM node
# Create app directory
WORKDIR /app
# Copy package.json and package-lock.json using a wildcard
COPY package*.json ./

# Copy tsconfig.build.json andtsconfig.build.json using a wildcard
COPY tsconfig*.json ./


# Install app dependencies
RUN npm install
# Bundle app source
COPY . /app
EXPOSE 5151
CMD ["node", "dist/main.js"]