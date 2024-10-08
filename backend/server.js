require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json()); 


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send({ error: 'Failed to fetch tasks', details: err.message });
    res.json(results);
  });
});


app.post('/tasks', (req, res) => {
  console.log('Request Body:', req.body); 
  const { assignedTo, status, priority, dueDate, description } = req.body;
  console.log(`Assigned To: ${assignedTo}, Status: ${status}, Priority: ${priority}, Due Date: ${dueDate}, Description: ${description}`);
  
  db.query(
    'INSERT INTO tasks (assignedTo, status, priority, dueDate, description) VALUES (?, ?, ?, ?, ?)', 
    [assignedTo, status, priority, dueDate, description], 
    (err, result) => {
      if (err) return res.status(500).send({ error: 'Failed to add task', details: err.message });
      res.json({ message: 'Task added', taskId: result.insertId });
    }
  );
});



app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { assignedTo, status, priority, dueDate, description } = req.body;
  
  db.query(
    'UPDATE tasks SET assignedTo = ?, status = ?, priority = ?, dueDate = ?, description = ? WHERE id = ?', 
    [assignedTo, status, priority, dueDate, description, id], 
    (err) => {
      if (err) return res.status(500).send({ error: 'Failed to update task', details: err.message });
      res.json({ message: 'Task updated' });
    }
  );
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params; 

  db.query(
    'DELETE FROM tasks WHERE id = ?', 
    [id], 
    (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Failed to delete task', details: err.message });
      }
      
      
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    }
  );
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
