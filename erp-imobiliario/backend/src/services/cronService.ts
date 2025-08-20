import cron from 'node-cron';
import { executeAutomacoesPendentes } from '../controllers/automacaoController';

// Executar automações baseadas em tempo a cada hora
const startAutomationCron = () => {
  console.log('🕒 Iniciando cron job para automações...');
  
  // Executar a cada hora
  cron.schedule('0 * * * *', async () => {
    console.log('⚡ Executando automações pendentes...');
    try {
      await executeAutomacoesPendentes();
      console.log('✅ Automações processadas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao executar automações:', error);
    }
  });

  // Executar automações urgentes a cada 15 minutos
  cron.schedule('*/15 * * * *', async () => {
    console.log('⚡ Verificando automações urgentes...');
    try {
      // Aqui podemos implementar automações mais frequentes
      // Por exemplo, follow-ups que vencem em breve
    } catch (error) {
      console.error('❌ Erro ao verificar automações urgentes:', error);
    }
  });
};

export { startAutomationCron };