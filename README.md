# 📚 Backend - Gestión de Libros

Este es el backend de la aplicación "Gestión de Libros", desarrollado con Node.js y Express. Permite realizar operaciones CRUD sobre libros almacenados en una base de datos.

---

## 🗄️ Estructura de la base de datos

La base de datos contiene una única tabla llamada `books` con la siguiente estructura:

| Campo   | Tipo    | Descripción              |
|---------|---------|--------------------------|
| id      | int     | Identificador único      |
| title   | string  | Título del libro         |
| author  | string  | Autor del libro          |
| year    | int     | Año de publicación       |
| genre   | string  | Género literario         |
| price   | number  | Precio del libro (COP)   |

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express.js
- CORS
- Dotenv
- Base de datos: (PostgreSQL)

---

## 🛠️ Configuración de la base de datos

Este proyecto usa **PostgreSQL** como sistema de gestión de base de datos.

### 📋 Requisitos

- Tener PostgreSQL instalado y en ejecución.
- Crear una base de datos, por ejemplo: `booksdb`

### 🧱 Estructura de la tabla

Ejecuta el siguiente script en tu base de datos para crear la tabla `books`:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  genre VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

### 🌱 Datos de ejemplo (seed)

Puedes poblar tu tabla `books` con algunos libros de prueba usando la siguiente consulta SQL:

```sql
-- Funciona para PostgreSQL, MySQL y SQLite
INSERT INTO books (title, author, year, genre, price) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 1967, 'Novela', 19.99),
('1984', 'George Orwell', 1949, 'Ciencia ficción', 15.50),
('El principito', 'Antoine de Saint-Exupéry', 1943, 'Fábula', 12.75),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 1605, 'Novela', 22.00),
('Orgullo y prejuicio', 'Jane Austen', 1813, 'Romance', 14.95);
