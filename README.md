# Challenge-Mini-Task-Tracker

Repositorio: https://github.com/WilyPardo3000/Challenge-Mini-Task-Tracker

Este proyecto es una mini aplicación "Task Tracker" con frontend en React y un backend simple en Node/Express (almacenamiento en memoria).

Requisitos
- Node.js (>= 16 recomendado)
- npm

Estructura
- `back/` — servidor Express (puerto por defecto `4000`)
- `front/` — app React creada con Create React App (puerto por defecto `3000`)

Cómo ejecutar (Windows PowerShell)

1) Backend

```powershell
cd C:\Users\<tu-usuario>\Documents\Mini-Task-Tracker\back
npm install
npm start
```

El servidor quedará escuchando en `http://localhost:4000` por defecto.

2) Frontend (abrir otra terminal)

```powershell
cd C:\Users\<tu-usuario>\Documents\Mini-Task-Tracker\front
npm install
npm start
```

CRA abrirá `http://localhost:3000` en el navegador; la aplicación cliente hace peticiones a `http://localhost:4000` por defecto.

Nota: si deseas apuntar el frontend a otra URL de API, exporta `REACT_APP_API_URL` antes de iniciar (ejemplo PowerShell):

```powershell
$env:REACT_APP_API_URL = 'http://mi-api:4000'
npm start
```

Comandos útiles

- Reiniciar la lista de tareas (endpoint de prueba):

  POST `http://localhost:4000/__reset` (por ejemplo con `curl` o `Invoke-RestMethod`)

- Para crear una tarea (ejemplo PowerShell):

```powershell
$body = @{ title = 'Tarea de ejemplo'; owner = 'Usuario' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/tasks' -ContentType 'application/json' -Body $body
```

Limitaciones y recomendaciones
- El backend usa almacenamiento en memoria: al reiniciar el servidor se perderán las tareas.
- El proyecto incluye estilos con Bootstrap (CDN en `front/public/index.html`) y algunos componentes ya adaptados.

Si quieres, puedo:
- Hacer el commit y push de este `README.md` al repositorio remoto ahora.
- Ajustar la ruta relativa en las instrucciones para que use rutas relativas al repo (en lugar de la ruta absoluta local).
