const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Endpoints CRUD

// Metodo GET - Obtener todos los libros
app.get('/books', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


//Metodo POST - Crear Libro
app.post('/books', async(req, res)=>{
    const {title, author, year, genre, price} = req.body;

    if(!title || !author || !year || !genre || !price){
        return res.status(400).json({error:'Faltan Campos obligatorios'})
    }

    try{
        const {rows} = await db.query(
            'INSERT INTO books (title, author, year, genre, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, year, genre, price]
        );
        res.status(201).json(rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Error a crear un Libro'})
    }
})


//Metodo GET:id - Buscar libro por id

app.get('/books/:id', async(req, res)=>{
    try{
        const {id} = req.params;

        if (isNaN(id)){
            return res.status(400).json({error: 'ID debe ser un número'});
        }

        const {rows} = await db.query('SELECT * FROM books WHERE id = $1', [id]);

        if(rows.lenght ===0){
            return res.status(500).json({
                error : 'Error al buscar el libro',
            });
        }

        res.json(rows[0]);
        
    } catch(err){
        console.error('Error en Get /books/:id', err);
        res.status(500).json({
            error : 'Error al buscar el libro',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


////Metodo PUT:id - actualiza libro por id
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre, price } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número válido' });
    }

    if (!title && !author && !year && !genre && !price) {
      return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar' });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (title) { fields.push(`title = $${paramIndex}`); values.push(title); paramIndex++; }
    if (author) { fields.push(`author = $${paramIndex}`); values.push(author); paramIndex++; }
    if (year) { fields.push(`year = $${paramIndex}`); values.push(year); paramIndex++; }
    if (genre) { fields.push(`genre = $${paramIndex}`); values.push(genre); paramIndex++; }
    if (price) { fields.push(`price = $${paramIndex}`); values.push(price); paramIndex++; }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE books 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(rows[0]); 

  } catch (err) {
    console.error('Error en PUT /books/:id:', err);
    res.status(500).json({ 
      error: 'Error al actualizar el libro',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


////Metodo DELETE:id - Eliminar  libro por id
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número válido' });
    }

    const { rowCount } = await db.query(
      'DELETE FROM books WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.status(204).send();

  } catch (err) {
    console.error('Error en DELETE /books/:id:', err);
    res.status(500).json({ 
      error: 'Error al eliminar el libro',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});