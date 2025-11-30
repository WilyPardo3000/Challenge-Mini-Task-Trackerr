import React, { useState } from 'react';

function TaskForm({ apiUrl, onCreate }) {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, owner, description: description || null })
      });
      const data = await resp.json();
      if (!resp.ok) {
        const msg = data && (data.message || (data.errors && data.errors.join(', '))) ? (data.message || data.errors.join(', ')) : 'Error';
        throw new Error(msg);
      }
      onCreate(data);
      setTitle(''); setOwner(''); setDescription('');
    } catch (err) {
      setError(err.message || 'Unknown');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form card p-3 shadow-sm" onSubmit={submit}>
      <h2 className="h5 mb-3">Crear nueva tarea</h2>

      <div className="mb-2">
        <input className="form-control" placeholder="Título..." value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>

      <div className="mb-2">
        <input className="form-control" placeholder="Owner " value={owner} onChange={e=>setOwner(e.target.value)} required />
      </div>

      <div className="mb-2">
        <textarea className="form-control" placeholder="Descripción..." value={description} onChange={e=>setDescription(e.target.value)} maxLength={150} />
      </div>

      <div className="d-flex gap-2 align-items-center">
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear tarea'}</button>
        {error ? <div className="text-danger small">{error}</div> : null}
      </div>
    </form>
  );
}

export default TaskForm;
