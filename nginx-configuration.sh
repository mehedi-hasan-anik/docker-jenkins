#!/bin/bash

# Exit on any error
set -e

# Colors for pretty output
GREEN="\033[0;32m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m" # No Color

NGINX_CONF="/etc/nginx/sites-available/monorepo.conf"
NGINX_ENABLED_CONF="/etc/nginx/sites-enabled/monorepo.conf"
PROXY_PARAMS="/etc/nginx/proxy_params"

LOCAL_IP=$(hostname -I | awk '{print $1}')

echo -e "${BLUE}=== Configuring NGINX for Web Gateway & Admin ===${NC}"

# ---------------------------------------
# ALWAYS RECREATE proxy_params
# ---------------------------------------
echo -e "${BLUE}Recreating proxy_params...${NC}"

sudo bash -c "cat > $PROXY_PARAMS" <<'EOF'
# Enhanced NGINX proxy settings (Auto-generated)

proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Cookie $http_cookie;

proxy_buffer_size 10m;
proxy_buffers 16 1m;
proxy_busy_buffers_size 10m;

proxy_connect_timeout 3600s;
proxy_send_timeout 3600s;
proxy_read_timeout 3600s;
send_timeout 3600s;
keepalive_timeout 3600s;
EOF

echo -e "${GREEN}✔ proxy_params updated.${NC}"

# ---------------------------------------
# Remove old NGINX config
# ---------------------------------------
if [ -f "$NGINX_CONF" ]; then
    echo -e "${BLUE}Removing old NGINX config...${NC}"
    sudo rm -f "$NGINX_CONF" "$NGINX_ENABLED_CONF"
fi

# ---------------------------------------
# Create NEW monorepo site config
# ---------------------------------------
echo -e "${BLUE}Creating new NGINX site configuration...${NC}"

sudo bash -c "cat > $NGINX_CONF" <<'EOF'
server {
    listen 82;
    server_name 127.0.0.1;

    # Web (Next.js app running on port 7000)
    location /app {
        proxy_pass http://localhost:7000/app;
        include /etc/nginx/proxy_params;
    }

    # Web HMR support
    location /app/_next/webpack-hmr {
        proxy_pass http://localhost:7000/app/_next/webpack-hmr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        include /etc/nginx/proxy_params;
    }

    # Admin (Port 7100)
    location /app/admin {
        proxy_pass http://localhost:7100/admin;
        include /etc/nginx/proxy_params;
    }

    # Admin HMR
    location /app/admin/_next/webpack-hmr {
        proxy_pass http://localhost:7100/admin/_next/webpack-hmr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        include /etc/nginx/proxy_params;
    }
}
EOF

echo -e "${GREEN}✔ NGINX site config created.${NC}"

# ---------------------------------------
# Enable site
# ---------------------------------------
echo -e "${BLUE}Enabling site...${NC}"
sudo ln -sf "$NGINX_CONF" "$NGINX_ENABLED_CONF"

# ---------------------------------------
# Test NGINX configuration
# ---------------------------------------
echo -e "${BLUE}Testing NGINX configuration...${NC}"
sudo nginx -t

# ---------------------------------------
# Reload NGINX
# ---------------------------------------
echo -e "${BLUE}Reloading NGINX...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}🎉 SUCCESS! NGINX configuration applied.${NC}"
echo -e "${GREEN}Web   → http://${LOCAL_IP}:82/app${NC}"
echo -e "${GREEN}Admin → http://${LOCAL_IP}:82/app/admin${NC}"
