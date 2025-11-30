import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState(null);

  // filtros
  const [query, setQuery] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTasks = async () => {
    try {
      setLoadingList(true);
      setError(null);
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filterOwner) params.append('owner', filterOwner);
      if (filterStatus) params.append('status', filterStatus);
      const resp = await fetch(`${API}/tasks?${params.toString()}`);
      if (!resp.ok) throw new Error('Error al mostrar tareas');
      const data = await resp.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [query, filterOwner, filterStatus]);

  const handleCreate = (newTask) => {
    // insertar al inicio
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const resp = await fetch(`${API}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || 'Error al actualizar estado');
      }
      const updated = await resp.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      alert('Error: ' + (err.message || 'Error desconocido'));
    }
  };

  const owners = Array.from(new Set(tasks.map(t => t.owner)));

  return (
    <div className="container">
      <h1 className="text-center mb-4">Mini Task Tracker</h1>
      <div className="top row">
        <div className="col-md-4">
          <TaskForm apiUrl={API} onCreate={handleCreate} />
        </div>
        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <div className="d-flex gap-2 mb-2">
              <input className="form-control" placeholder="Buscar por título..." value={query} onChange={e=>setQuery(e.target.value)} />
              <select className="form-select" value={filterOwner} onChange={e=>setFilterOwner(e.target.value)}>
                <option value="">Todos los owners</option>
                {owners.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select className="form-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="completed">Completa</option>
                <option value="incompleted">Incompleta</option>
              </select>
              <button className="btn btn-outline-secondary" onClick={() => { setQuery(''); setFilterOwner(''); setFilterStatus(''); }}>Limpiar</button>
            </div>
            <div>
              <small className="text-muted">Filtra la lista de tareas por título, owner o estado.</small>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {loadingList ? <p>Cargando tareas...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <TaskList tasks={tasks} onToggleStatus={handleToggleStatus} />
    </div>
  );
}

export default App;
