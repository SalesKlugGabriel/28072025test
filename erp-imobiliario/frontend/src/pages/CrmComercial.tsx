import React from 'react';

const CrmComercial: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CRM Comercial</h1>
        <p className="text-gray-600">Pipeline de vendas com integração WhatsApp</p>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Módulo CRM Comercial será implementado aqui.</p>
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <p>• Kanban dinâmico com workflows personalizáveis</p>
          <p>• Chat estilo WhatsApp integrado</p>
          <p>• Geração automática de propostas e contratos</p>
          <p>• Conversão de leads para clientes</p>
        </div>
      </div>
    </div>
  );
};

export default CrmComercial;