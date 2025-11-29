# Stage 1: Build the React app
FROM node:20-alpine AS build
 
# Set working directory
WORKDIR /app
 
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci
 
# Copy all source files
COPY . .
 
# Build the app for production
RUN npm run build
 
# Stage 2: Serve with Nginx
FROM nginx:alpine
 
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
 
# Copy build files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html
 
# Optional: Copy a custom Nginx config (if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# Expose port 80
EXPOSE 80
 
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]