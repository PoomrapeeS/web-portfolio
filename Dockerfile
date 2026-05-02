# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static portfolio files
COPY src/ /usr/share/nginx/html/

# Nginx runs on ports 80 (HTTP redirect) and 443 (HTTPS)
EXPOSE 80 443

# Validate config then start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/health || exit 1
