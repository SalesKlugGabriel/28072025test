#!/usr/bin/env node
/**
 * 🚀 LEGASYS ERP - STATUS CHECKER v3.0
 * Script para diagnóstico completo do sistema
 * Uso: node status-checker.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class LegaSysStatusChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {},
      frontend: {},
      backend: {},
      modules: {},
      issues: [],
      recommendations: []
    };
  }

  // 📊 Método principal de análise
  async analyze() {
    console.log('🔍 LEGASYS ERP - ANÁLISE DE STATUS INICIADA...\n');
    
    try {
      await this.checkProjectStructure();
      await this.analyzeFrontend();
      await this.analyzeBackend();
      await this.checkModuleStatus();
      await this.checkDependencies();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Erro durante análise:', error.message);
    }
  }

  // 📁 Verificar estrutura do projeto
  async checkProjectStructure() {
    console.log('📁 Verificando estrutura do projeto...');
    
    const expectedDirs = [
      'src',
      'public',
      'erp-imobiliario',
      'src/components',
      'src/pages',
      'src/hooks',
      'src/services',
      'src/contexts',
      'erp-imobiliario/src',
      'erp-imobiliario/components'
    ];

    const existingDirs = [];
    const missingDirs = [];

    expectedDirs.forEach(dir => {
      const fullPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(fullPath)) {
        existingDirs.push(dir);
      } else {
        missingDirs.push(dir);
      }
    });

    this.results.summary.structureComplete = missingDirs.length === 0;
    this.results.summary.existingDirs = existingDirs;
    this.results.summary.missingDirs = missingDirs;

    if (missingDirs.length > 0) {
      this.results.issues.push(`Pastas ausentes: ${missingDirs.join(', ')}`);
    }
  }

  // ⚛️ Analisar Frontend React
  async analyzeFrontend() {
    console.log('⚛️ Analisando Frontend React...');
    
    // Verificar package.json na raiz (projeto React unificado)
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      this.results.frontend.dependencies = Object.keys(packageJson.dependencies || {});
      this.results.frontend.devDependencies = Object.keys(packageJson.devDependencies || {});
      
      // Verificar dependências essenciais
      const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
      const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
      if (missingDeps.length > 0) {
        this.results.issues.push(`Dependências ausentes: ${missingDeps.join(', ')}`);
      }
    }

    // Contar componentes na pasta src
    const srcComponentsPath = path.join(this.projectRoot, 'src/components');
    const erpComponentsPath = path.join(this.projectRoot, 'erp-imobiliario/components');
    let allComponents = [];

    if (fs.existsSync(srcComponentsPath)) {
      const components = this.getFilesRecursive(srcComponentsPath, '.jsx', '.js', '.tsx', '.ts');
      allComponents.push(...components);
    }

    if (fs.existsSync(erpComponentsPath)) {
      const components = this.getFilesRecursive(erpComponentsPath, '.jsx', '.js', '.tsx', '.ts');
      allComponents.push(...components);
    }

    this.results.frontend.components = allComponents.map(f => path.relative(this.projectRoot, f));
    this.results.frontend.componentCount = allComponents.length;

    // Contar páginas
    const pagesPath = path.join(this.projectRoot, 'src/pages');
    if (fs.existsSync(pagesPath)) {
      const pages = this.getFilesRecursive(pagesPath, '.jsx', '.js', '.tsx', '.ts');
      this.results.frontend.pages = pages.map(f => path.relative(this.projectRoot, f));
      this.results.frontend.pageCount = pages.length;
    }

    // Verificar hooks customizados
    const hooksPath = path.join(this.projectRoot, 'src/hooks');
    if (fs.existsSync(hooksPath)) {
      const hooks = this.getFilesRecursive(hooksPath, '.js', '.jsx', '.ts', '.tsx');
      this.results.frontend.hooks = hooks.map(f => path.relative(this.projectRoot, f));
      this.results.frontend.hookCount = hooks.length;
    }

    // Verificar arquivos principais
    const mainFiles = ['App.jsx', 'App.js', 'App.tsx', 'main.jsx', 'main.js', 'main.tsx', 'index.js', 'index.jsx'];
    this.results.frontend.mainFiles = [];
    mainFiles.forEach(file => {
      if (fs.existsSync(path.join(this.projectRoot, 'src', file))) {
        this.results.frontend.mainFiles.push(file);
      }
    });
  }

  // 🔧 Analisar Backend Node.js
  async analyzeBackend() {
    console.log('🔧 Analisando Backend Node.js...');
    
    // Como não há pasta backend separada, verificar se há APIs/services na estrutura atual
    this.results.backend.note = 'Projeto unificado - sem pasta backend separada';
    
    // Verificar se há arquivos de API ou services
    const apiPaths = [
      path.join(this.projectRoot, 'src/api'),
      path.join(this.projectRoot, 'src/services'),
      path.join(this.projectRoot, 'erp-imobiliario/api'),
      path.join(this.projectRoot, 'api'),
      path.join(this.projectRoot, 'server')
    ];

    let apiFiles = [];
    apiPaths.forEach(apiPath => {
      if (fs.existsSync(apiPath)) {
        const files = this.getFilesRecursive(apiPath, '.js', '.ts');
        apiFiles.push(...files);
      }
    });

    this.results.backend.apiFiles = apiFiles.map(f => path.relative(this.projectRoot, f));
    this.results.backend.apiCount = apiFiles.length;

    // Verificar se há configuração de servidor
    const serverFiles = ['server.js', 'server.ts', 'app.js', 'app.ts'];
    this.results.backend.serverFiles = [];
    serverFiles.forEach(file => {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        this.results.backend.serverFiles.push(file);
      }
    });
  }

  // 📊 Verificar status dos módulos principais
  async checkModuleStatus() {
    console.log('📊 Verificando status dos módulos...');
    
    const modules = [
      { name: 'Dashboard', files: ['Dashboard.jsx', 'dashboard'] },
      { name: 'Cadastros', files: ['Cadastros.jsx', 'cadastros', 'CadastroClientes.jsx'] },
      { name: 'Empreendimentos', files: ['Empreendimentos.jsx', 'empreendimentos'] },
      { name: 'CRM', files: ['CRM.jsx', 'crm', 'Kanban.jsx'] },
      { name: 'Financeiro', files: ['Financeiro.jsx', 'financeiro'] },
      { name: 'Relatórios', files: ['Relatorios.jsx', 'relatorios'] },
      { name: 'Configurações', files: ['Configuracoes.jsx', 'configuracoes'] }
    ];

    modules.forEach(module => {
      const status = {
        implemented: false,
        files: [],
        completion: 0
      };

      // Verificar arquivos do módulo
      module.files.forEach(fileName => {
        const found = this.findFileInProject(fileName);
        if (found.length > 0) {
          status.implemented = true;
          status.files.push(...found);
        }
      });

      // Calcular nível de completude (básico)
      if (status.implemented) {
        status.completion = Math.min(status.files.length * 20, 100);
      }

      this.results.modules[module.name] = status;
    });
  }

  // 📦 Verificar dependências
  async checkDependencies() {
    console.log('📦 Verificando dependências...');
    
    try {
      // Verificar se node_modules existe na raiz (projeto unificado)
      const nodeModules = path.join(this.projectRoot, 'node_modules');
      
      this.results.summary.depsInstalled = fs.existsSync(nodeModules);

      if (!this.results.summary.depsInstalled) {
        this.results.recommendations.push('Execute: npm install');
      }

      // Verificar Vite config
      const viteConfig = path.join(this.projectRoot, 'vite.config.ts');
      if (fs.existsSync(viteConfig)) {
        this.results.summary.buildTool = 'Vite';
      }

      // Verificar TypeScript
      const tsConfig = path.join(this.projectRoot, 'tsconfig.json');
      if (fs.existsSync(tsConfig)) {
        this.results.summary.typescript = true;
      }
    } catch (error) {
      this.results.issues.push(`Erro ao verificar dependências: ${error.message}`);
    }
  }

  // 📄 Gerar relatório final
  async generateReport() {
    const report = this.generateTextReport();
    
    // Salvar relatório em arquivo
    const reportPath = path.join(this.projectRoot, 'legasys-status-report.txt');
    fs.writeFileSync(reportPath, report);
    
    console.log(report);
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    console.log('\n💡 Cole este relatório no início de conversas com o Claude para contexto rápido!');
  }

  // 📋 Gerar texto do relatório
  generateTextReport() {
    const { results } = this;
    const timestamp = new Date().toLocaleString('pt-BR');
    
    let report = `
🚀 LEGASYS ERP - RELATÓRIO DE STATUS
📅 Gerado em: ${timestamp}
🔗 Repositório: https://github.com/SalesKlugGabriel/28072025test

═══════════════════════════════════════════════════════════

📊 RESUMO EXECUTIVO:
✅ Estrutura do Projeto: ${results.summary.structureComplete ? 'COMPLETA' : 'INCOMPLETA'}
✅ Dependências: ${results.summary.depsInstalled ? 'INSTALADAS' : 'AUSENTES'}
✅ Build Tool: ${results.summary.buildTool || 'Não identificado'}
✅ TypeScript: ${results.summary.typescript ? 'CONFIGURADO' : 'NÃO CONFIGURADO'}

⚛️ FRONTEND (React + Vite + Tailwind):
📁 Componentes: ${results.frontend.componentCount || 0}
📄 Páginas: ${results.frontend.pageCount || 0} 
🎣 Hooks: ${results.frontend.hookCount || 0}
🗂️ Arquivos Principais: ${results.frontend.mainFiles ? results.frontend.mainFiles.join(', ') : 'Nenhum'}

🔧 BACKEND/API:
📝 Nota: ${results.backend.note || 'Backend separado'}
📡 APIs/Services: ${results.backend.apiCount || 0}
🖥️ Server Files: ${results.backend.serverFiles ? results.backend.serverFiles.join(', ') : 'Nenhum'}

═══════════════════════════════════════════════════════════

📋 STATUS DOS MÓDULOS:
`;

    Object.entries(results.modules).forEach(([name, status]) => {
      const icon = status.implemented ? '✅' : '❌';
      const completion = status.completion || 0;
      report += `${icon} ${name}: ${completion}% (${status.files.length} arquivos)\n`;
    });

    if (results.issues.length > 0) {
      report += `\n⚠️ PROBLEMAS IDENTIFICADOS:\n`;
      results.issues.forEach(issue => {
        report += `❗ ${issue}\n`;
      });
    }

    if (results.recommendations.length > 0) {
      report += `\n💡 RECOMENDAÇÕES:\n`;
      results.recommendations.forEach(rec => {
        report += `🔧 ${rec}\n`;
      });
    }

    report += `\n═══════════════════════════════════════════════════════════
🎯 PRÓXIMOS PASSOS SUGERIDOS:
1. Verificar e corrigir problemas identificados
2. Completar módulos com baixa implementação
3. Testar funcionalidades existentes
4. Implementar módulos ausentes

📞 PARA O CLAUDE:
Este é o status atual do LegaSys ERP. Use estas informações para:
- Focar nos módulos que precisam de atenção
- Evitar recriar código já existente  
- Dar continuidade ao desenvolvimento de forma eficiente
`;

    return report;
  }

  // 🔍 Métodos auxiliares
  getFilesRecursive(dir, ...extensions) {
    if (!fs.existsSync(dir)) return [];
    
    let files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getFilesRecursive(fullPath, ...extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  findFileInProject(fileName) {
    const found = [];
    const searchDirs = [
      path.join(this.projectRoot, 'frontend/src'),
      path.join(this.projectRoot, 'backend/src')
    ];
    
    searchDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = this.getFilesRecursive(dir, '.js', '.jsx', '.ts', '.tsx');
        const matches = files.filter(file => 
          path.basename(file).toLowerCase().includes(fileName.toLowerCase())
        );
        found.push(...matches);
      }
    });
    
    return found;
  }
}

// 🚀 Executar se chamado diretamente
if (require.main === module) {
  const checker = new LegaSysStatusChecker();
  checker.analyze();
}

module.exports = LegaSysStatusChecker;