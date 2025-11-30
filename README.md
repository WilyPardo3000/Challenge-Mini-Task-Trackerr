# Challenge-Mini-Task-Tracker

Repositorio: https://github.com/WilyPardo3000/Challenge-Mini-Task-Trackerr

Pequeña aplicación "Task Tracker" con frontend en React (Create React App) y backend en Node/Express (almacenamiento en memoria).

Resumen rápido
- Backend: ack/ (Express)  puerto por defecto 4000.
- Frontend: ront/ (React CRA)  puerto por defecto 3000.

Requisitos
- Node.js (recomendado >= 16)
- npm

Pasos para que cualquiera inicialice el proyecto (Windows PowerShell)

1) Clonar el repositorio

`powershell
git clone https://github.com/WilyPardo3000/Challenge-Mini-Task-Trackerr.git
cd Challenge-Mini-Task-Tracker
`

2) Iniciar el backend

`powershell
cd back
npm install
npm start
`

El servidor escuchará por defecto en http://localhost:4000.

3) Iniciar el frontend (en otra terminal)

`powershell
cd front
npm install
npm start
`

CRA arrancará el dev server y normalmente abrirá http://localhost:3000. El frontend usa la variable de entorno REACT_APP_API_URL para cambiar la URL de la API si es necesario.

Configurar REACT_APP_API_URL en PowerShell (solo para la sesión actual)

`powershell
 = 'http://localhost:4000'
npm start
`

Notas útiles
- Ejecuta primero el ack y luego el ront para evitar errores de conexión.
- El backend almacena las tareas en memoria: al reiniciar el servidor se perderán.
- Si el navegador no muestra la app, revisa la salida de 
pm start y asegúrate de que no haya puertos ocupados.

Comandos para probar endpoints (PowerShell)

- Reiniciar la lista de tareas (endpoint de prueba):

`powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/__reset'
`

- Crear una tarea (ejemplo):

`powershell
 = @{ title = 'Tarea de ejemplo'; owner = 'Usuario' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/tasks' -ContentType 'application/json' -Body 
`

Sobre ront y submódulos
- Si antes no veías la carpeta ront en GitHub, era porque ront estaba como submódulo. Ya convertimos ront en una carpeta normal y sus archivos ahora están en el repo remoto.

Archivos importantes
- ack/index.js: servidor Express y rutas (/tasks, /__reset, etc.)
- ront/src/: componentes React (TaskForm, TaskList, TaskCard, App.js)
- ront/public/index.html: incluye CDN de Bootstrap

Consejos adicionales
- Si vas a desplegar en otro equipo o CI, instala las dependencias en ack y ront por separado.
- Para compartir el repositorio: comparte la URL de GitHub y la otra persona puede seguir los pasos anteriores.

¿Quieres que haga esto por ti?
- Puedo commitear y pushear este README.md ahora (si quieres), o ajustar el enlace del git clone si prefieres otra URL.

---

Copias de seguridad locales
- Si tienes una carpeta ront_backup, contiene la copia que hicimos antes de convertir el submódulo.

Gracias  dime si quieres que empuje este cambio al remoto ahora.
