#!/bin/bash

# 🚀 Script de Auto-Instalação Legacy.87 ERP
# Executa: chmod +x install.sh && sudo ./install.sh

set -e

echo "🏢 Legacy.87 ERP - Auto Instalação"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   print_error "Este script deve ser executado como root (sudo)"
   exit 1
fi

# Detectar OS
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    print_error "Não foi possível detectar o sistema operacional"
    exit 1
fi

print_status "Sistema detectado: $OS $VER"

# Configurações
DB_NAME="legasys_erp"
DB_USER="legasys_user"
APP_DIR="/var/www/legasys-erp"
NGINX_CONF="/etc/nginx/sites-available/legasys"

# Solicitar configurações do usuário
echo ""
echo "📝 Configurações do Deploy"
echo "========================="

read -p "🔗 Domínio da aplicação (ex: erp.seudominio.com): " DOMAIN
read -p "🗄️  Senha do banco PostgreSQL: " -s DB_PASS
echo ""
read -p "🔑 JWT Secret (deixe em branco para gerar): " JWT_SECRET
if [[ -z "$JWT_SECRET" ]]; then
    JWT_SECRET=$(openssl rand -base64 32)
fi

echo ""
print_status "Iniciando instalação..."

# 1. Atualizar sistema
print_status "Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar dependências básicas
print_status "Instalando dependências básicas..."
apt install -y curl wget git software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# 3. Instalar Node.js 18
print_status "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalação
node_version=$(node --version)
npm_version=$(npm --version)
print_success "Node.js $node_version e npm $npm_version instalados"

# 4. Instalar PostgreSQL
print_status "Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Iniciar e habilitar PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# 5. Configurar PostgreSQL
print_status "Configurando banco de dados..."
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF

print_success "Banco de dados configurado"

# 6. Instalar Nginx
print_status "Instalando Nginx..."
apt install -y nginx

# 7. Instalar PM2
print_status "Instalando PM2..."
npm install -g pm2

# 8. Criar diretório da aplicação
print_status "Criando estrutura de diretórios..."
mkdir -p $APP_DIR
cd $APP_DIR

# 9. Clonar ou copiar aplicação
print_status "Preparando aplicação..."
if [[ -n "$1" ]]; then
    # Se passou URL do Git como parâmetro
    git clone $1 .
else
    print_warning "Sem repositório Git especificado. Você precisará copiar os arquivos manualmente para $APP_DIR"
    mkdir -p backend frontend
fi

# 10. Configurar Backend
if [[ -d "backend" ]]; then
    print_status "Configurando backend..."
    cd backend
    
    # Instalar dependências
    npm install
    
    # Criar arquivo .env
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"

# Server
PORT=3001
HOST=0.0.0.0
NODE_ENV=production

# JWT
JWT_SECRET="$JWT_SECRET"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"

# CORS
CORS_ORIGINS="https://$DOMAIN,http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Logs
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/legasys/app.log
EOF

    # Executar migrações
    npx prisma generate
    npx prisma db push
    
    # Executar setup do Legacy.87
    if [[ -f "scripts/setup-legacy87.js" ]]; then
        node scripts/setup-legacy87.js
    fi
    
    print_success "Backend configurado"
    cd ..
fi

# 11. Configurar Frontend
if [[ -d "frontend" ]]; then
    print_status "Configurando frontend..."
    cd frontend
    
    # Instalar dependências
    npm install
    
    # Criar arquivo .env
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

# 12. Configurar Nginx
print_status "Configurando Nginx..."
cat > $NGINX_CONF << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Frontend
    location / {
        root $APP_DIR/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Backend
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
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
EOF

# Habilitar site
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t
systemctl reload nginx

print_success "Nginx configurado"

# 13. Configurar PM2
print_status "Configurando PM2 para produção..."
cd $APP_DIR/backend

# Criar ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'legasys-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/legasys/err.log',
    out_file: '/var/log/legasys/out.log',
    log_file: '/var/log/legasys/combined.log',
    time: true
  }]
}
EOF

# Criar diretório de logs
mkdir -p /var/log/legasys
chown -R www-data:www-data /var/log/legasys

# Build do TypeScript
npm run build

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_success "PM2 configurado"

# 14. Configurar SSL (Let's Encrypt)
print_status "Configurando SSL..."
apt install -y snapd
snap install --classic certbot

# Gerar certificado
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

print_success "SSL configurado"

# 15. Configurar Firewall
print_status "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'

print_success "Firewall configurado"

# 16. Configurar backup automático
print_status "Configurando backup automático..."
cat > /usr/local/bin/backup-legasys.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/legasys"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup do banco
pg_dump -U $DB_USER -h localhost $DB_NAME > \$BACKUP_DIR/db_backup_\$DATE.sql

# Backup dos arquivos
tar -czf \$BACKUP_DIR/files_backup_\$DATE.tar.gz $APP_DIR

# Manter apenas os últimos 7 backups
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup realizado: \$DATE"
EOF

chmod +x /usr/local/bin/backup-legasys.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-legasys.sh") | crontab -

print_success "Backup automático configurado (diário às 2h)"

# 17. Verificar serviços
print_status "Verificando serviços..."
systemctl status postgresql --no-pager -l
systemctl status nginx --no-pager -l
pm2 status

print_success "✅ Instalação concluída com sucesso!"

echo ""
echo "🎉 Legacy.87 ERP instalado!"
echo "=========================="
echo "🌐 URL: https://$DOMAIN"
echo "🗄️  Banco: $DB_NAME"
echo "👤 Usuário: $DB_USER"
echo ""
echo "👥 Credenciais padrão:"
echo "   📧 gabriel@legacy87.com.br"
echo "   🔑 Luegabi0609!"
echo ""
echo "📊 Monitoramento:"
echo "   pm2 status"
echo "   pm2 logs legasys-backend"
echo "   tail -f /var/log/legasys/combined.log"
echo ""
echo "🔧 Comandos úteis:"
echo "   systemctl status legasys"
echo "   nginx -t && systemctl reload nginx"
echo "   /usr/local/bin/backup-legasys.sh"
echo ""
print_success "Sistema pronto para uso!"