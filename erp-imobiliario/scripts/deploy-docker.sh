#!/bin/bash

# 🐳 Deploy Legacy.87 ERP com Docker
# Executa: chmod +x deploy-docker.sh && ./deploy-docker.sh

set -e

echo "🐳 Legacy.87 ERP - Deploy Docker"
echo "================================"

# Configurações
read -p "🔗 Domínio da aplicação: " DOMAIN
read -p "🗄️  Senha do banco PostgreSQL: " -s DB_PASS
echo ""

# Criar docker-compose.yml para produção
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: legasys_erp
      POSTGRES_USER: legasys_user
      POSTGRES_PASSWORD: $DB_PASS
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "127.0.0.1:5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U legasys_user"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      DATABASE_URL: postgresql://legasys_user:$DB_PASS@postgres:5432/legasys_erp
      PORT: 3001
      NODE_ENV: production
      JWT_SECRET: \$(openssl rand -base64 32)
      CORS_ORIGINS: https://$DOMAIN
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      VITE_API_URL: https://$DOMAIN/api
      VITE_APP_NAME: Legacy.87
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs
      - frontend_dist:/var/www/html
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
  frontend_dist:
EOF

# Criar Dockerfile para backend
mkdir -p backend
cat > backend/Dockerfile.prod << EOF
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["npm", "start"]
EOF

# Criar Dockerfile para frontend
mkdir -p frontend
cat > frontend/Dockerfile.prod << EOF
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EOF

# Criar configuração Nginx
cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name $DOMAIN;

        location / {
            proxy_pass http://frontend:80;
        }

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

# Script de backup
cat > backup.sh << EOF
#!/bin/bash
docker exec -t \$(docker-compose -f docker-compose.prod.yml ps -q postgres) pg_dumpall -c -U legasys_user > backup_\$(date +%Y%m%d_%H%M%S).sql
EOF

chmod +x backup.sh

echo "✅ Arquivos Docker criados!"
echo "Para deploy:"
echo "1. docker-compose -f docker-compose.prod.yml up -d"
echo "2. ./backup.sh (para backup)"