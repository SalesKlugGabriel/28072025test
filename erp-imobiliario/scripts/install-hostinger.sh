#!/bin/bash

# 🏢 Legacy.87 ERP - Instalação Hostinger VPS
# Especializado para VPS da Hostinger

set -e

echo "🏢 Legacy.87 ERP - Hostinger VPS"
echo "==============================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[✅]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[⚠️]${NC} $1"; }
print_error() { echo -e "${RED}[❌]${NC} $1"; }

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   print_error "Execute como root: sudo ./install-hostinger.sh"
   exit 1
fi

print_status "Detectando sistema..."
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    print_success "Sistema: $NAME $VERSION_ID"
else
    print_error "Sistema não suportado"
    exit 1
fi

# Configurações específicas Hostinger
print_status "Configurações para Hostinger VPS"
echo "================================="

# Verificar se já tem informações
if [[ -f "/root/.legasys-config" ]]; then
    print_status "Carregando configurações salvas..."
    source /root/.legasys-config
    print_warning "Domínio salvo: $DOMAIN"
    read -p "Usar configurações salvas? (y/n): " USE_SAVED
    if [[ $USE_SAVED != "y" ]]; then
        rm -f /root/.legasys-config
    fi
fi

if [[ ! -f "/root/.legasys-config" ]]; then
    read -p "🔗 Seu domínio (ex: meusite.com): " DOMAIN
    read -p "📧 Seu email para SSL: " EMAIL
    read -p "🗄️ Senha do PostgreSQL: " -s DB_PASS
    echo ""
    
    # Gerar JWT secrets
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    
    # Salvar configurações
    cat > /root/.legasys-config << EOF
DOMAIN="$DOMAIN"
EMAIL="$EMAIL"
DB_PASS="$DB_PASS"
JWT_SECRET="$JWT_SECRET"
JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
EOF
    print_success "Configurações salvas"
fi

# Configurações fixas
DB_NAME="legasys_erp"
DB_USER="legasys_user"
APP_DIR="/var/www/legasys-erp"

print_status "Iniciando instalação para $DOMAIN..."

# 1. Atualizar sistema (Hostinger VPS Ubuntu)
print_status "Atualizando sistema Ubuntu..."
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y

# 2. Instalar dependências
print_status "Instalando dependências básicas..."
apt install -y curl wget git software-properties-common apt-transport-https ca-certificates gnupg lsb-release unzip

# 3. Instalar Node.js 18 (método oficial NodeSource)
print_status "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalação
node_version=$(node --version)
npm_version=$(npm --version)
print_success "Node.js $node_version e npm $npm_version"

# 4. Instalar PostgreSQL 14
print_status "Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib postgresql-client

# Iniciar PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# 5. Configurar PostgreSQL
print_status "Configurando banco de dados..."
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
ALTER USER $DB_USER WITH SUPERUSER;
\q
EOF

# Configurar postgresql.conf para aceitar conexões
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
systemctl restart postgresql

print_success "PostgreSQL configurado"

# 6. Instalar Nginx
print_status "Instalando Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 7. Instalar PM2 globalmente
print_status "Instalando PM2..."
npm install -g pm2

# 8. Configurar firewall UFW (Hostinger VPS)
print_status "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 5432/tcp
print_success "Firewall configurado"

# 9. Criar estrutura de diretórios
print_status "Criando estrutura de aplicação..."
mkdir -p $APP_DIR
mkdir -p /var/log/legasys
mkdir -p /var/backups/legasys

# 10. Se projeto já existe no diretório atual
if [[ -d "./backend" && -d "./frontend" ]]; then
    print_status "Copiando arquivos do projeto..."
    cp -r ./* $APP_DIR/
elif [[ -d "./erp-imobiliario" ]]; then
    print_status "Copiando arquivos do projeto (erp-imobiliario)..."
    cp -r ./erp-imobiliario/* $APP_DIR/
else
    print_warning "Projeto não encontrado no diretório atual"
    print_status "Estrutura de diretórios criada em $APP_DIR"
    print_warning "Copie os arquivos manualmente para $APP_DIR"
    mkdir -p $APP_DIR/backend $APP_DIR/frontend
fi

cd $APP_DIR

# 11. Configurar Backend
if [[ -d "backend" ]]; then
    print_status "Configurando backend..."
    cd backend
    
    # Instalar dependências
    npm install --production
    
    # Criar .env
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"

# Server  
PORT=3001
HOST=0.0.0.0
NODE_ENV=production

# JWT
JWT_SECRET="$JWT_SECRET"
JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"

# CORS
CORS_ORIGINS="https://$DOMAIN,https://www.$DOMAIN"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Logs
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/legasys/app.log

# Features
ENABLE_RATE_LIMITING=true
ENABLE_CORS=true
ENABLE_HELMET=true
EOF

    # Gerar Prisma client e executar migrações
    npx prisma generate
    npx prisma db push
    
    # Setup da organização Legacy.87
    if [[ -f "scripts/setup-legacy87.js" ]]; then
        print_status "Criando organização Legacy.87..."
        node scripts/setup-legacy87.js
    fi
    
    # Build TypeScript
    if [[ -f "tsconfig.json" ]]; then
        npm run build
    fi
    
    print_success "Backend configurado"
    cd ..
fi

# 12. Configurar Frontend
if [[ -d "frontend" ]]; then
    print_status "Configurando frontend..."
    cd frontend
    
    # Instalar dependências
    npm install
    
    # Criar .env.production
    cat > .env.production << EOF
VITE_API_URL=https://$DOMAIN/api
VITE_APP_NAME=Legacy.87
VITE_APP_VERSION=3.0.0
NODE_ENV=production
EOF

    # Build para produção
    npm run build
    
    print_success "Frontend configurado"
    cd ..
fi

# 13. Configurar Nginx (configuração otimizada Hostinger)
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/legasys << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (will be added by Certbot)
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-Forwarded-Proto \$scheme;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # Frontend React App
    location / {
        root $APP_DIR/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # CORS Headers
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Health Check
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/legasys /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t && systemctl reload nginx

print_success "Nginx configurado"

# 14. Configurar PM2 Ecosystem
print_status "Configurando PM2..."
cd $APP_DIR/backend

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'legasys-backend',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/legasys/err.log',
    out_file: '/var/log/legasys/out.log',
    log_file: '/var/log/legasys/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    kill_timeout: 5000
  }]
}
EOF

# Configurar permissões
chown -R www-data:www-data $APP_DIR
chown -R www-data:www-data /var/log/legasys
chmod -R 755 $APP_DIR

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_success "PM2 configurado"

# 15. Instalar e configurar SSL com Certbot
print_status "Configurando SSL com Let's Encrypt..."
apt install -y snapd
snap install core; snap refresh core
snap install --classic certbot

# Criar symlink
ln -sf /snap/bin/certbot /usr/bin/certbot

# Gerar certificado SSL
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

print_success "SSL configurado"

# 16. Configurar backup automático
print_status "Configurando backup automático..."
cat > /usr/local/bin/backup-legasys.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/legasys"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup PostgreSQL
PGPASSWORD="$DB_PASS" pg_dump -U $DB_USER -h localhost $DB_NAME > \$BACKUP_DIR/db_\$DATE.sql

# Backup arquivos aplicação
tar -czf \$BACKUP_DIR/app_\$DATE.tar.gz $APP_DIR --exclude="$APP_DIR/node_modules" --exclude="$APP_DIR/*/node_modules"

# Manter apenas últimos 7 backups
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "\$(date): Backup realizado - \$DATE" >> /var/log/legasys/backup.log
EOF

chmod +x /usr/local/bin/backup-legasys.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-legasys.sh") | crontab -

print_success "Backup automático configurado"

# 17. Verificações finais
print_status "Verificando instalação..."

# Testar serviços
systemctl status postgresql --no-pager -l
systemctl status nginx --no-pager -l
pm2 status

# Testar conectividade
sleep 5
curl -f http://localhost:3001/health > /dev/null 2>&1 && print_success "Backend funcionando" || print_warning "Backend pode precisar de alguns minutos"

# 18. Informações finais
print_success "================================="
print_success "🎉 INSTALAÇÃO CONCLUÍDA!"
print_success "================================="
echo ""
echo "🌐 URL: https://$DOMAIN"
echo "📧 SSL: Configurado para $EMAIL"
echo "🗄️ Banco: $DB_NAME"
echo ""
echo "👥 Credenciais Legacy.87:"
echo "   📧 Email: gabriel@legacy87.com.br"
echo "   🔑 Senha: Luegabi0609!"
echo ""
echo "🛠️ Comandos úteis:"
echo "   pm2 status"
echo "   pm2 logs legasys-backend"
echo "   systemctl status nginx"
echo "   /usr/local/bin/backup-legasys.sh"
echo ""
print_success "Sistema Legacy.87 rodando em: https://$DOMAIN"
print_warning "DNS pode levar até 30 minutos para propagar"

# Log de instalação
echo "$(date): Instalação Legacy.87 concluída - $DOMAIN" >> /var/log/legasys/install.log

print_success "✅ Deploy na Hostinger VPS finalizado!"