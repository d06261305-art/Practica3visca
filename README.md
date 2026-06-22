# Practica 2B - Biblioteca CRUD NoSQL

Segunda practica del segundo archivo, diferente a inventario. Usa la misma arquitectura full-stack desacoplada:

- `biblioteca-backend`: API con Express, Mongoose y MongoDB Atlas.
- `biblioteca-frontend`: interfaz web consumiendo la API.

## Operaciones CRUD

- Crear libro.
- Buscar por titulo, autor, genero o estado.
- Actualizar libro.
- Eliminar libro.

## Backend

```bash
cd biblioteca-backend
npm install
copy .env.example .env
npm start
```

## Frontend

Abre `biblioteca-frontend/index.html` o subelo a Vercel. Cambia `API_URL` en `app.js` por la URL publica de Render terminando en `/libros`.
