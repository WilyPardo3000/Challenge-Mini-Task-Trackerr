import React, { useState } from 'react';

function TaskCard({ task, onToggleStatus }) {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    const newStatus = task.status === 'completed' ? 'incompleted' : 'completed';
    try {
      setLoading(true);
      await onToggleStatus(task.id, newStatus);
    } catch (err) {
      // error manejado por el componente padre
    } finally {
      setLoading(false);
    }
  };

  const actionIsMarkIncompleted = task.status === 'completed';

  return (
    <div className={`card mb-3 ${task.status === 'incompleted' ? 'border-danger' : ''}`}>
      <div className="card-body">
        <h5 className="card-title text-center">{task.title}</h5>
        <p className="card-subtitle mb-2 text-muted text-center">Owner: {task.owner} • Status: <span className="text-capitalize">{task.status}</span></p>
        <p className="card-text">{task.description ? task.description : <span className="text-muted">Sin descripción</span>}</p>
        <div className="d-flex justify-content-end">
          <button
            className={`btn btn-sm ${actionIsMarkIncompleted ? 'btn-danger' : 'btn-success'}`}
            onClick={toggle}
            disabled={loading}
          >
            {loading ? '...' : (actionIsMarkIncompleted ? 'Marcar incompleto' : 'Marcar completado')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
