# Use the lightweight Nginx image
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend files into the Nginx server directory
COPY . /usr/share/nginx/html

# Nginx runs on port 80 by default
EXPOSE 80