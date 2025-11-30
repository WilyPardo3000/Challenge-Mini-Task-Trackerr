const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria
let tasks = [];

// Funciones auxiliares
function findTaskById(id) {
  return tasks.find(t => String(t.id) === String(id));
}

function validateTaskBody(body, isCreate = true) {
  const errors = [];

  if (isCreate) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('Es necesario que escribas el titulo, no puede estar vacío.');
    }
    if (!body.owner || typeof body.owner !== 'string' || !body.owner.trim()) {
      errors.push('Es necesario que escribas el owner, no puede estar vacío.');
    }
  } else {
    if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) {
      errors.push('Es necesario que escribas el titulo, no puede estar vacío.');
    }
    if (body.owner !== undefined && (typeof body.owner !== 'string' || !body.owner.trim())) {
      errors.push('Es necesario que escribas el owner, no puede estar vacío.');
    }
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') {
      errors.push('La descripción debe ser una cadena de texto o nula.');
    } else if (body.description.length > 150) {
      errors.push('La descripción debe tener como máximo 150 caracteres.');
    }
  }

  if (body.status !== undefined) {
    if (!['completed','incompleted'].includes(body.status)) {
      errors.push('El estado debe ser "completed" o "incompleted".');
    }
  }

  return errors;
}

// GET /tasks - listar todas (opcionalmente acepta filtros, pero la lista básica es suficiente)
app.get('/tasks', (req, res) => {
  // permite filtros simples en la query: ?q=búsquedaTitulo&owner=nombre&status=completed
  const { q, owner, status } = req.query;
  let out = tasks.slice();

  if (q) {
    const ql = String(q).toLowerCase();
    out = out.filter(t => t.title.toLowerCase().includes(ql));
  }
  if (owner) {
    out = out.filter(t => t.owner === owner);
  }
  if (status) {
    out = out.filter(t => t.status === status);
  }

  res.json(out);
});

// POST /tasks - crear
app.post('/tasks', (req, res) => {
  const body = req.body;
  const errors = validateTaskBody(body, true);
  if (errors.length) {
    return res.status(400).json({ message: 'Error de validación', errors });
  }

  // Título único
  const titleExists = tasks.some(t => t.title.toLowerCase() === body.title.toLowerCase());
  if (titleExists) {
    return res.status(409).json({ message: 'El título debe ser único.' });
  }

  // el owner no puede tener más de 3 tareas incompletas
  const ownerIncompletedCount = tasks.filter(t => t.owner === body.owner && t.status === 'incompleted').length;
  // el estado de la nueva tarea es 'incompleted' por defecto, salvo que se pase 'completed'
  const newStatus = body.status ? body.status : 'incompleted';
  if (newStatus === 'incompleted' && ownerIncompletedCount >= 3) {
    return res.status(400).json({ message: 'El owner no puede tener más de 3 tareas incompletas.' });
  }

  const newTask = {
    id: Date.now().toString(), // id simple y único
    title: body.title,
    description: body.description ? body.description : null,
    owner: body.owner,
    status: newStatus
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

// PATCH /tasks/:id - cambiar estado (o actualización parcial)
app.patch('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const task = findTaskById(id);
  if (!task) {
    return res.status(404).json({ message: 'Tarea no encontrada.' });
  }

  // Permitimos específicamente actualizar el estado (completed/incompleted). También validamos campos genéricos.
  const errors = validateTaskBody(body, false);
  if (errors.length) {
    return res.status(400).json({ message: 'Error de validación', errors });
  }

  if (body.status !== undefined) {
    if (!['completed','incompleted'].includes(body.status)) {
      return res.status(400).json({ message: 'Valor de estado inválido.' });
    }

    if (body.status === 'incompleted' && task.status !== 'incompleted') {
      // si se cambia a 'incompleted', asegurar que el owner no tenga más de 3 incompletas
      const ownerIncompletedCount = tasks.filter(t => t.owner === task.owner && t.status === 'incompleted').length;
      if (ownerIncompletedCount >= 3) {
        return res.status(400).json({ message: 'El owner no puede tener más de 3 tareas incompletas.' });
      }
    }

    task.status = body.status;
  }

  if (body.title !== undefined) {
    // comprobación de título único
    const titleExists = tasks.some(t => t.id !== task.id && t.title.toLowerCase() === body.title.toLowerCase());
    if (titleExists) {
      return res.status(409).json({ message: 'El título debe ser único.' });
    }
    task.title = body.title;
  }

  if (body.description !== undefined) {
    task.description = body.description;
  }

  if (body.owner !== undefined) {
    // Al cambiar el owner, garantizar que el nuevo owner no viole el límite de tareas incompletas
    if (task.status === 'incompleted') {
      const newOwnerIncompletedCount = tasks.filter(t => t.owner === body.owner && t.status === 'incompleted').length;
      if (newOwnerIncompletedCount >= 3) {
        return res.status(400).json({ message: 'El owner no puede tener más de 3 tareas incompletas.' });
      }
    }
    task.owner = body.owner;
  }

  return res.json(task);
});

// Ruta pequeña para reiniciar tareas (útil para pruebas) - opcional
app.post('/__reset', (req, res) => {
  tasks = [];
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
