import React from 'react';

const Compras: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compras (Para Obras)</h1>
        <p className="text-gray-600">Gestão de requisições, cotações e pedidos de compra</p>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Módulo Compras será implementado aqui.</p>
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <p>• Requisições de compra por obra/setor</p>
          <p>• Cotações múltiplas com comparativo</p>
          <p>• Workflow de aprovação configurável</p>
          <p>• Pedidos de compra automatizados</p>
          <p>• Integração com almoxarifado e financeiro</p>
        </div>
      </div>
    </div>
  );
};

export default Compras;