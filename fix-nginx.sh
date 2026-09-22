#!/bin/bash
# Run this ONCE on the host machine. It will:
#   1. Enable passwordless sudo for the current user
#   2. Disable the old bnppams nginx config
#   3. Install the new monorepo nginx config
#   4. Reload nginx
#
# Usage:
#   chmod +x fix-nginx.sh
#   ./fix-nginx.sh

set -e

echo "==> Step 1: Enable passwordless sudo for $(whoami)"
sudo tee /etc/sudoers.d/$(whoami)-nopasswd > /dev/null <<EOF
$(whoami) ALL=(ALL) NOPASSWD: ALL
EOF
sudo chmod 440 /etc/sudoers.d/$(whoami)-nopasswd
echo "    OK"
echo ""

echo "==> Step 2: Disable old bnppams nginx config (if present)"
if [ -f /etc/nginx/sites-enabled/turbo.conf ]; then
    sudo rm -f /etc/nginx/sites-enabled/turbo.conf
    echo "    Removed turbo.conf"
else
    echo "    turbo.conf not found, skipping"
fi
echo ""

echo "==> Step 3: Write new monorepo nginx config"
sudo tee /etc/nginx/sites-available/monorepo.conf > /dev/null <<'EOF'
server {
    listen 82;
    server_name 127.0.0.1;

    # Web (Next.js app on port 7000)
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

    # Admin (Next.js app on port 7100)
    location /app/admin {
        proxy_pass http://localhost:7100/admin;
        include /etc/nginx/proxy_params;
    }

    # Admin HMR support
    location /app/admin/_next/webpack-hmr {
        proxy_pass http://localhost:7100/admin/_next/webpack-hmr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        include /etc/nginx/proxy_params;
    }
}
EOF

# Ensure proxy_params has at least the basic directives
if [ ! -f /etc/nginx/proxy_params ]; then
    sudo tee /etc/nginx/proxy_params > /dev/null <<'EOF'
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

proxy_buffer_size 10m;
proxy_buffers 16 1m;
proxy_busy_buffers_size 10m;

proxy_connect_timeout 3600s;
proxy_send_timeout 3600s;
proxy_read_timeout 3600s;
send_timeout 3600s;
keepalive_timeout 3600s;
EOF
fi

sudo ln -sf /etc/nginx/sites-available/monorepo.conf /etc/nginx/sites-enabled/monorepo.conf
echo "    Wrote /etc/nginx/sites-available/monorepo.conf and enabled it"
echo ""

echo "==> Step 4: Test nginx config"
sudo nginx -t
echo ""

echo "==> Step 5: Reload nginx"
sudo systemctl reload nginx
echo ""

echo "🎉 Done! Try http://10.11.105.61:82/app and http://10.11.105.61:82/app/admin"
