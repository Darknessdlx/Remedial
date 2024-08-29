const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el paquete cors
const app = express();
const port = 3000;

// Configuración de CORS
app.use(cors());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tasks'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Middleware
app.use(bodyParser.json());

// Rutas

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Obtener una tarea por ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// Crear una nueva tarea
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    const sql = 'INSERT INTO tasks (title, description, done, createAt) VALUES (?, ?, 0, NOW())';
    db.query(sql, [title, description], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id: result.insertId, title, description, done: 0, createAt: new Date() });
    });
});

// Actualizar una tarea
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, done } = req.body;
    const sql = 'UPDATE tasks SET title = ?, description = ?, done = ? WHERE id = ?';
    db.query(sql, [title, description, done, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id, title, description, done });
    });
});

// Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Tarea eliminada' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
