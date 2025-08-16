# 🔗 Integração WhatsApp + Google Calendar

Este documento explica como configurar e usar as integrações do chat com WhatsApp (Evolution API) e Google Calendar.

## 📱 WhatsApp (Evolution API)

### Pré-requisitos

1. **Evolution API**: Uma instância da Evolution API rodando
   - Repositório: https://github.com/EvolutionAPI/evolution-api
   - Docker: `docker run --name evolution-api -p 8080:8080 atendai/evolution-api`

2. **Configurações necessárias**:
   - URL base da API (ex: `https://evolution-api.exemplo.com`)
   - API Key gerada pela Evolution API
   - Nome da instância (ex: `legasys_erp`)

### Como configurar:

1. Acesse a configuração de integrações no sistema
2. Na aba "WhatsApp (Evolution API)", preencha:
   - **URL Base**: URL onde sua Evolution API está rodando
   - **API Key**: Chave de acesso à API
   - **Nome da Instância**: Nome único para sua instância
3. Clique em "Conectar WhatsApp"
4. Se aparecer um QR Code, escaneie com seu WhatsApp
5. Aguarde a confirmação de conexão

### Funcionalidades disponíveis:

- ✅ Envio de mensagens de texto
- ✅ Recebimento de mensagens em tempo real
- ✅ Status de entrega (enviado, entregue, lido)
- ✅ Verificação de números válidos no WhatsApp
- ✅ Envio de mídias (imagens, documentos, etc.)
- ✅ Histórico de conversas

## 📅 Google Calendar

### Pré-requisitos

1. **Google Cloud Console**: Projeto configurado
   - Acesse: https://console.developers.google.com/
   - Crie um projeto ou use existente

2. **APIs habilitadas**:
   - Google Calendar API
   - Google Meet API (para videoconferências)

3. **Credenciais OAuth 2.0**:
   - Client ID
   - API Key

### Como configurar:

1. **No Google Cloud Console**:
   - Vá em "APIs e Serviços" > "Credenciais"
   - Clique em "Criar credenciais" > "ID do cliente OAuth 2.0"
   - Tipo: "Aplicativo da Web"
   - Origens JavaScript autorizadas: adicione sua URL (ex: `https://seudominio.com`)
   - URIs de redirecionamento autorizados: adicione sua URL + `/auth/callback`

2. **No sistema**:
   - Acesse configuração de integrações
   - Na aba "Google Calendar", preencha:
     - **Google Client ID**: ID do cliente OAuth
     - **Google API Key**: Chave da API
   - Clique em "Conectar Google Calendar"
   - Faça login com sua conta Google
   - Autorize as permissões solicitadas

### Funcionalidades disponíveis:

- ✅ Criação de eventos no calendário
- ✅ Geração automática de links Google Meet
- ✅ Envio de convites por email
- ✅ Agendamento via chat do WhatsApp
- ✅ Integração com perfil do cliente
- ✅ Verificação de disponibilidade

## 💬 Como usar o Chat Integrado

### Comandos disponíveis:

- `/template [nome]` - Usar template de mensagem
- `/agendar` - Abrir modal de agendamento
- `/meet` - Enviar link de videoconferência
- `/"nome_empreendimento"` - Enviar informações do empreendimento
- `/@responsavel` - Mencionar responsável

### Fluxo de agendamento:

1. Digite `/agendar` no chat
2. Preencha o formulário:
   - **Título**: Nome do compromisso
   - **Data e Hora**: Quando será o encontro
   - **Tipo**: Reunião, Visita ou Ligação
   - **Google Meet**: Marque para incluir videoconferência
   - **Descrição**: Detalhes do compromisso

3. Clique em "Agendar"
4. O sistema:
   - Cria o evento no Google Calendar
   - Gera link do Google Meet (se solicitado)
   - Envia convite por email para o cliente
   - Envia confirmação via WhatsApp
   - Salva o link no perfil do cliente

## 🔧 Solução de Problemas

### WhatsApp não conecta:

1. Verifique se a Evolution API está rodando
2. Confirme a URL e API Key
3. Verifique se o nome da instância é único
4. Tente recriar a instância se necessário

### Google Calendar não autoriza:

1. Verifique as URLs autorizadas no Google Console
2. Confirme se as APIs estão habilitadas
3. Teste as credenciais em ambiente de desenvolvimento
4. Limpe o cache do navegador

### Mensagens não chegam:

1. Verifique a conexão WhatsApp
2. Confirme se o número é válido
3. Teste com um número conhecido
4. Verifique logs da Evolution API

### Eventos não são criados:

1. Confirme a autenticação Google
2. Verifique permissões do calendário
3. Teste com um evento simples
4. Verifique formato de data/hora

## 🚀 Próximos Passos

- [ ] Webhook para receber mensagens automaticamente
- [ ] Integração com CRM boards (arrastar lead após agendamento)
- [ ] Lembretes automáticos por WhatsApp
- [ ] Integração com Zoom/Teams
- [ ] Templates de mensagem personalizáveis
- [ ] Relatórios de conversas
- [ ] Chat em grupo
- [ ] Bot com IA para respostas automáticas

## 📞 Suporte

Para dúvidas sobre as integrações:

1. Verifique este documento
2. Consulte os logs do navegador (F12)
3. Teste em ambiente controlado
4. Documente erros encontrados

---

**Desenvolvido para LegaSys ERP 3.0** 🏢