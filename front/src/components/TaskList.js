import React from 'react';

function TaskList({ tasks, onToggleStatus }) {
  if (!tasks || tasks.length === 0) return <p>No hay tareas.</p>;

  return (
    <div className="task-list mt-3">
      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Título</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Descripción</th>
              <th style={{ width: 160 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} className={t.status === 'completed' ? 'table-success' : ''}>
                <td>{t.title}</td>
                <td>{t.owner}</td>
                <td className="text-capitalize">{t.status}</td>
                <td>{t.description ? t.description : <span className="text-muted">Sin descripción</span>}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${t.status === 'completed' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => onToggleStatus(t.id, t.status === 'completed' ? 'incompleted' : 'completed')}
                    >
                      {t.status === 'completed' ? 'Marcar incompleto' : 'Marcar completado'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;
