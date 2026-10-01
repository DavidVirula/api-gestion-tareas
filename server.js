const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ REEMPLAZA ESTA CADENA POR TU URL REAL DE MONGODB ATLAS
const MONGO_URI = 'TU_CADENA_DE_CONEXION_DE_MONGODB_ATLAS';

// Conexión a la Base de Datos en la Nube
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Conectado exitosamente a MongoDB Atlas'))
    .catch(err => console.error('🔴 Error al conectar a MongoDB:', err));

// Definición del Modelo de Datos (Esquema de la Tarea)
const TaskSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    completada: { type: Boolean, default: false },
    fechaCreacion: { type: String, default: () => new Date().toISOString() }
}, {
    // Convierte automáticamente el _id de Mongo a un campo id limpio para el Frontend
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

const Task = mongoose.model('Task', TaskSchema);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// RUTAS DE LA API (CRUD REFACTORIZADO A BASE DE DATOS)
// ==========================================

// 1. GET: Obtener todas las tareas de la base de datos
app.get('/api/tasks', async (req, res) => {
    try {
        const tareas = await Task.find();
        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las tareas" });
    }
});

// 2. GET: Obtener una tarea por ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const tarea = await Task.findById(req.params.id);
        if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
        res.status(200).json(tarea);
    } catch (error) {
        res.status(404).json({ error: "ID inválido o tarea no encontrada" });
    }
});

// 3. POST: Crear una nueva tarea con validación
app.post('/api/tasks', async (req, res) => {
    const { titulo, descripcion } = req.body;
    
    if (!titulo || !descripcion) {
        return res.status(400).json({ error: "El título y la descripción son obligatorios" });
    }
    
    try {
        const nuevaTarea = new Task({ titulo, descripcion });
        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la tarea" });
    }
});

// 4. PUT: Actualizar una tarea por ID
app.put('/api/tasks/:id', async (req, res) => {
    const { titulo, descripcion, completada } = req.body;
    
    if (titulo === undefined && descripcion === undefined && completada === undefined) {
        return res.status(400).json({ error: "Debes enviar al menos un campo para actualizar" });
    }
    
    try {
        const camposActualizar = {};
        if (titulo !== undefined) camposActualizar.titulo = titulo;
        if (descripcion !== undefined) camposActualizar.descripcion = descripcion;
        if (completada !== undefined) camposActualizar.completada = completada;

        const tareaActualizada = await Task.findByIdAndUpdate(
            req.params.id, 
            camposActualizar, 
            { new: true } // Retorna el documento ya modificado
        );

        if (!tareaActualizada) return res.status(404).json({ error: "Tarea no encontrada" });
        res.status(200).json(tareaActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
});

// 5. DELETE: Eliminar una tarea por ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const tareaEliminada = await Task.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) return res.status(404).json({ error: "Tarea no encontrada" });
        res.status(200).json({ mensaje: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
