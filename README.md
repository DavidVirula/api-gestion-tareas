# API RESTful de Gestión de Tareas

Servicio web tipo API REST independiente para la administración estructurada de un catálogo de tareas utilizando Node.js, Express y persistencia de datos en formato JSON.

**URL Base de Producción:** `https://api-gestion-tareas-david.onrender.com`

## 📊 Tabla de Rutas y Endpoints

| Método | Endpoint | Descripción | Código Éxito | Código Error |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Obtiene el listado completo de tareas. | 200 OK | 500 Internal Error |
| **GET** | `/api/tasks/:id` | Busca una tarea individual por su ID único. | 200 OK | 404 Not Found |
| **POST** | `/api/tasks` | Crea una nueva tarea con validación de campos. | 201 Created | 400 Bad Request |
| **PUT** | `/api/tasks/:id` | Modifica parcial o totalmente una tarea existente. | 200 OK | 400 BR / 404 NF |
| **DELETE**| `/api/tasks/:id` | Elimina definitivamente una tarea por su ID. | 200 OK | 404 Not Found |

## 🛠️ Estructura y Ejemplos de Datos (Payloads JSON)

### 1. Objeto Tarea de Entrada (POST / PUT)
```json
{
  "titulo": "Estudiar para el examen",
  "descripcion": "Repasar conceptos de APIs RESTful y códigos HTTP"
}
```

### 2. Objeto Tarea de Salida (Response)
```json
{
  "id": "1710543210452",
  "titulo": "Estudiar para el examen",
  "descripcion": "Repasar conceptos de APIs RESTful y códigos HTTP",
  "completada": false,
  "fechaCreacion": "2026-03-12T04:30:00.000Z"
}
```

### 3. Respuesta de Error por Validación (400 Bad Request)
```json
{
  "error": "El título y la descripción son obligatorios"
}
```
