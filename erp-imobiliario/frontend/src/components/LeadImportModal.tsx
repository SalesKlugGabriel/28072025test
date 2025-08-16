import React, { useState, useRef } from 'react';
import { 
  Upload, Download, FileSpreadsheet, CheckCircle, 
  AlertCircle, X, MapPin, Settings, Eye, Users
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: any[]) => void;
}

interface ColumnMapping {
  excelColumn: string;
  crmField: string;
  required: boolean;
}

const LeadImportModal: React.FC<LeadImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    warnings: number;
  }>({ success: 0, errors: 0, warnings: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Campos CRM disponíveis
  const crmFields = [
    { value: 'nome', label: 'Nome Completo', required: true },
    { value: 'email', label: 'Email', required: true },
    { value: 'telefone', label: 'Telefone', required: true },
    { value: 'whatsapp', label: 'WhatsApp', required: false },
    { value: 'origem', label: 'Origem do Lead', required: false },
    { value: 'interesse', label: 'Interesse/Produto', required: false },
    { value: 'valor', label: 'Valor de Interesse', required: false },
    { value: 'observacoes', label: 'Observações', required: false },
    { value: 'cidade', label: 'Cidade', required: false },
    { value: 'profissao', label: 'Profissão', required: false },
    { value: 'renda', label: 'Renda', required: false },
    { value: 'estado_civil', label: 'Estado Civil', required: false }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        
        if (jsonData.length > 0) {
          const headers = jsonData[0].map((header: any) => String(header));
          const dataRows = jsonData.slice(1);
          
          setExcelHeaders(headers);
          setExcelData(dataRows);
          
          // Auto-mapear colunas comuns
          const autoMapping = autoMapColumns(headers);
          setColumnMapping(autoMapping);
          
          setStep('mapping');
        }
      } catch (error) {
        alert('Erro ao ler arquivo. Certifique-se de que é um arquivo Excel válido.');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const autoMapColumns = (headers: string[]): ColumnMapping[] => {
    const commonMappings: Record<string, string[]> = {
      'nome': ['nome', 'name', 'nome completo', 'full name', 'cliente'],
      'email': ['email', 'e-mail', 'mail', 'electronic mail'],
      'telefone': ['telefone', 'phone', 'tel', 'celular', 'mobile'],
      'whatsapp': ['whatsapp', 'whats', 'wpp'],
      'origem': ['origem', 'source', 'origem lead', 'canal'],
      'interesse': ['interesse', 'produto', 'empreendimento'],
      'valor': ['valor', 'price', 'preço', 'orçamento'],
      'cidade': ['cidade', 'city', 'localização'],
      'profissao': ['profissão', 'profissao', 'job', 'trabalho'],
      'renda': ['renda', 'income', 'salário', 'salario']
    };

    const mapping: ColumnMapping[] = [];
    
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      let mappedField = '';
      
      for (const [crmField, keywords] of Object.entries(commonMappings)) {
        if (keywords.some(keyword => headerLower.includes(keyword))) {
          mappedField = crmField;
          break;
        }
      }
      
      if (mappedField || index < 5) { // Mapear automaticamente as primeiras 5 colunas se não encontrar correspondência
        mapping.push({
          excelColumn: header,
          crmField: mappedField || (index < crmFields.length ? crmFields[index].value : ''),
          required: crmFields.find(f => f.value === mappedField)?.required || false
        });
      }
    });

    return mapping;
  };

  const updateColumnMapping = (index: number, crmField: string) => {
    setColumnMapping(prev => 
      prev.map((mapping, i) => 
        i === index 
          ? { 
              ...mapping, 
              crmField, 
              required: crmFields.find(f => f.value === crmField)?.required || false
            }
          : mapping
      )
    );
  };

  const validateMapping = (): boolean => {
    const requiredFields = crmFields.filter(f => f.required).map(f => f.value);
    const mappedFields = columnMapping.map(m => m.crmField).filter(Boolean);
    
    return requiredFields.every(field => mappedFields.includes(field));
  };

  const previewData = () => {
    if (!validateMapping()) {
      alert('Por favor, mapeie todos os campos obrigatórios (Nome, Email, Telefone)');
      return;
    }
    setStep('preview');
  };

  const processImport = async () => {
    setStep('importing');
    setImportProgress(0);
    
    const processedLeads: any[] = [];
    let successCount = 0;
    let errorCount = 0;
    let warningCount = 0;

    for (let i = 0; i < Math.min(excelData.length, 1000); i++) { // Limitar a 1000 leads
      const row = excelData[i];
      const lead: any = {
        id: `imported_${Date.now()}_${i}`,
        dataCriacao: new Date().toISOString().split('T')[0],
        estagioId: 'lead',
        temperatura: 'morno',
        prioridade: 'media',
        responsavel: 'Sistema',
        tags: ['importado'],
        score: 50
      };

      let hasError = false;
      let hasWarning = false;

      // Mapear dados
      columnMapping.forEach((mapping, index) => {
        if (mapping.crmField && row[index] !== undefined) {
          const value = String(row[index]).trim();
          
          if (mapping.crmField === 'valor') {
            const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
            lead[mapping.crmField] = isNaN(numValue) ? 0 : numValue;
          } else {
            lead[mapping.crmField] = value;
          }

          // Validações
          if (mapping.required && !value) {
            hasError = true;
          }
          
          if (mapping.crmField === 'email' && value && !value.includes('@')) {
            hasWarning = true;
          }
          
          if (mapping.crmField === 'telefone' && value && value.length < 10) {
            hasWarning = true;
          }
        }
      });

      if (hasError) {
        errorCount++;
      } else {
        if (hasWarning) warningCount++;
        processedLeads.push(lead);
        successCount++;
      }

      setImportProgress(((i + 1) / excelData.length) * 100);
      
      // Simular delay para mostrar progresso
      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    setImportResults({ success: successCount, errors: errorCount, warnings: warningCount });
    
    // Chamar callback de importação
    if (processedLeads.length > 0) {
      onImport(processedLeads);
    }

    setTimeout(() => {
      setStep('preview');
    }, 2000);
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Nome Completo', 'Email', 'Telefone', 'WhatsApp', 'Origem', 'Interesse', 'Valor', 'Cidade', 'Observações'],
      ['João Silva Santos', 'joao@email.com', '(48) 99999-1234', '48999991234', 'site', 'Apartamento 2 quartos', '450000', 'Florianópolis', 'Cliente interessado'],
      ['Maria Oliveira', 'maria@email.com', '(48) 88888-5678', '48888885678', 'indicacao', 'Casa com piscina', '650000', 'São José', 'Busca urgente']
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Leads');
    XLSX.writeFile(wb, 'template_importacao_leads.xlsx');
  };

  const resetImport = () => {
    setStep('upload');
    setFile(null);
    setExcelData([]);
    setExcelHeaders([]);
    setColumnMapping([]);
    setImportProgress(0);
    setImportResults({ success: 0, errors: 0, warnings: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Importar Leads</h2>
                <p className="text-sm text-gray-600">Excel, CSV ou Google Sheets</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[
              { key: 'upload', label: 'Upload', icon: Upload },
              { key: 'mapping', label: 'Mapeamento', icon: Settings },
              { key: 'preview', label: 'Prévia', icon: Eye },
              { key: 'importing', label: 'Importando', icon: Users }
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.key;
              const isCompleted = ['upload', 'mapping', 'preview'].indexOf(step) > ['upload', 'mapping', 'preview'].indexOf(stepItem.key);
              
              return (
                <div key={stepItem.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' :
                    isCompleted ? 'text-green-600' :
                    'text-gray-500'
                  }`}>
                    {stepItem.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
                  <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione o arquivo</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Suporte para Excel (.xlsx, .xls) e CSV
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Escolher Arquivo
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">📋 Preparação do arquivo:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• A primeira linha deve conter os cabeçalhos das colunas</li>
                  <li>• Campos obrigatórios: Nome, Email e Telefone</li>
                  <li>• Remova linhas vazias e dados duplicados</li>
                  <li>• Máximo de 1.000 leads por importação</li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mx-auto"
                >
                  <Download className="w-4 h-4" />
                  Baixar Template Excel
                </button>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mapeamento de Colunas</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Associe as colunas do Excel aos campos do CRM. Campos marcados com * são obrigatórios.
                </p>
              </div>

              <div className="space-y-3">
                {columnMapping.map((mapping, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Coluna Excel: <span className="font-bold text-blue-600">{mapping.excelColumn}</span>
                      </label>
                      <div className="text-xs text-gray-500 mt-1">
                        Exemplo: {excelData[0]?.[index] || 'N/A'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <select
                        value={mapping.crmField}
                        onChange={(e) => updateColumnMapping(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Não mapear</option>
                        {crmFields.map(field => (
                          <option key={field.value} value={field.value}>
                            {field.label} {field.required ? '*' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-16 text-center">
                      {mapping.required && (
                        <span className="text-red-600 text-sm font-medium">Obrigatório</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Prévia dos Dados</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Verifique como os dados serão importados. Serão processados até {Math.min(excelData.length, 1000)} registros.
                </p>
              </div>

              {importResults.success > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Importação Concluída!</span>
                  </div>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>✅ {importResults.success} leads importados com sucesso</div>
                    {importResults.warnings > 0 && (
                      <div>⚠️ {importResults.warnings} leads com avisos (dados incompletos)</div>
                    )}
                    {importResults.errors > 0 && (
                      <div>❌ {importResults.errors} leads com erro (dados obrigatórios faltando)</div>
                    )}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {columnMapping.filter(m => m.crmField).map((mapping, index) => (
                        <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                          {crmFields.find(f => f.value === mapping.crmField)?.label}
                          {mapping.required && <span className="text-red-600 ml-1">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-200">
                        {columnMapping.filter(m => m.crmField).map((mapping, colIndex) => {
                          const originalIndex = columnMapping.findIndex(m => m.excelColumn === mapping.excelColumn);
                          const value = row[originalIndex];
                          return (
                            <td key={colIndex} className="px-4 py-3 text-sm text-gray-900">
                              {value || <span className="text-gray-400">-</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {excelData.length > 5 && (
                <p className="text-sm text-gray-600 text-center">
                  ... e mais {excelData.length - 5} registros
                </p>
              )}
            </div>
          )}

          {step === 'importing' && (
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Importando Leads...</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {Math.round(importProgress)}% concluído
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {file && (
                <span>📄 {file.name} ({excelData.length} registros)</span>
              )}
            </div>
            <div className="flex gap-3">
              {step !== 'importing' && (
                <>
                  <button
                    onClick={step === 'upload' ? onClose : () => setStep('upload')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {step === 'upload' ? 'Cancelar' : 'Voltar'}
                  </button>
                  
                  {step === 'mapping' && (
                    <button
                      onClick={previewData}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={!validateMapping()}
                    >
                      Visualizar Dados
                    </button>
                  )}
                  
                  {step === 'preview' && importResults.success === 0 && (
                    <button
                      onClick={processImport}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Importar {Math.min(excelData.length, 1000)} Leads
                    </button>
                  )}
                  
                  {step === 'preview' && importResults.success > 0 && (
                    <button
                      onClick={resetImport}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Nova Importação
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadImportModal;