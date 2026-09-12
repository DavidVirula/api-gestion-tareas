const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'tareas.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Funciones auxiliares para leer y escribir en el archivo JSON (Persistencia)
const leerTareas = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const guardarTareas = (tareas) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tareas, null, 2));
};

// ==========================================
// RUTAS DE LA API (CRUD COMPLETAS)
// ==========================================

// 1. GET: Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
    const tareas = leerTareas();
    res.status(200).json(tareas);
});

// 2. GET: Obtener una tarea por ID
app.get('/api/tasks/:id', (req, res) => {
    const tareas = leerTareas();
    const tarea = tareas.find(t => t.id === req.params.id);
    
    if (!tarea) {
        return res.status(404).json({ error: "Tarea no encontrada" });
    }
    
    res.status(200).json(tarea);
});

// 3. POST: Crear una nueva tarea (Con Validación)
app.post('/api/tasks', (req, res) => {
    const { titulo, descripcion } = req.body;
    
    // Validación de datos de entrada obligatorios
    if (!titulo || !descripcion) {
        return res.status(400).json({ error: "El título y la descripción son obligatorios" });
    }
    
    const tareas = leerTareas();
    const nuevaTarea = {
        id: Date.now().toString(), // Genera un ID único basado en tiempo
        titulo,
        descripcion,
        completada: false,
        fechaCreacion: new Date().toISOString()
    };
    
    tareas.push(nuevaTarea);
    guardarTareas(tareas);
    
    res.status(201).json(nuevaTarea); // 201 Created
});

// 4. PUT: Actualizar una tarea por ID (Modificación total/parcial)
app.put('/api/tasks/:id', (req, res) => {
    const { titulo, descripcion, completada } = req.body;
    const tareas = leerTareas();
    const index = tareas.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Tarea no encontrada" });
    }
    
    // Validación: Al menos un campo debe enviarse para actualizar
    if (titulo === undefined && descripcion === undefined && completada === undefined) {
        return res.status(400).json({ error: "Debes enviar al menos un campo para actualizar (titulo, descripcion o completada)" });
    }
    
    // Actualización parcial o total
    if (titulo !== undefined) tareas[index].titulo = titulo;
    if (descripcion !== undefined) tareas[index].descripcion = descripcion;
    if (completada !== undefined) tareas[index].completada = completada;
    
    guardarTareas(tareas);
    res.status(200).json(tareas[index]);
});

// 5. DELETE: Eliminar una tarea por ID
app.delete('/api/tasks/:id', (req, res) => {
    const tareas = leerTareas();
    const tareasFiltradas = tareas.filter(t => t.id !== req.params.id);
    
    if (tareas.length === tareasFiltradas.length) {
        return res.status(404).json({ error: "Tarea no encontrada" });
    }
    
    guardarTareas(tareasFiltradas);
    res.status(200).json({ mensaje: "Tarea eliminada correctamente" }); // O 204 sin contenido
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
