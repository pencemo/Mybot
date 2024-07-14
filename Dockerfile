# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 3000

# Command to run the bot
CMD ["node", "bot.js"]  
