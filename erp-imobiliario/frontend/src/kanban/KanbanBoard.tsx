import React, { useState } from 'react';

interface Stage {
  id: string;
  name: string;
}

/**
 * KanbanBoard renders a customizable full screen pipeline where
 * administrators may add, rename and reorder stages.
 * Drag and drop behaviour is omitted for brevity.
 */
export default function KanbanBoard() {
  const [stages, setStages] = useState<Stage[]>([
    { id: 'novo', name: 'Novo' },
    { id: 'contato', name: 'Contato' },
    { id: 'proposta', name: 'Proposta' }
  ]);

  const addStage = (index: number) => {
    const id = `stage-${Date.now()}`;
    const updated = [...stages];
    updated.splice(index, 0, { id, name: 'Nova etapa' });
    setStages(updated);
  };

  const renameStage = (id: string, name: string) => {
    setStages(stages.map(s => (s.id === id ? { ...s, name } : s)));
  };

  return (
    <div className="kanban-full">
      {stages.map((s, idx) => (
        <div key={s.id} className="stage">
          <h3
            contentEditable
            suppressContentEditableWarning
            onBlur={e => renameStage(s.id, e.currentTarget.textContent || '')}
          >
            {s.name}
          </h3>
          <button onClick={() => addStage(idx + 1)}>+</button>
          {/* TODO: render cards with tags and filters */}
        </div>
      ))}
    </div>
  );
}