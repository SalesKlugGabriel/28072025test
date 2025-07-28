import React from 'react';

const Arquitetura: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Arquitetura (Projetos e Aprovações)</h1>
        <p className="text-gray-600">Centralização de projetos técnicos e aprovações</p>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">Módulo Arquitetura será implementado aqui.</p>
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <p>• Upload e versionamento de arquivos (DWG, PDF, BIM)</p>
          <p>• Classificação por disciplina (arquitetônico, estrutural, elétrico)</p>
          <p>• Compatibilização e registro de conflitos</p>
          <p>• Comunicação com Engenharia e Jurídico</p>
          <p>• Controle de RRT/ART dos responsáveis</p>
        </div>
      </div>
    </div>
  );
};

export default Arquitetura;