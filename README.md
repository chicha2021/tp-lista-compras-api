# Lista de Compras API

API REST simple en Node.js para gestionar una lista de compras (crear, listar, editar, marcar como comprado y eliminar productos). Los datos se guardan en memoria. Trabajo Práctico N° 1 – Git y Docker.

## Tecnologías y requisitos

- Node.js 20 (sin dependencias externas, solo módulos nativos)
- Git
- Docker (para ejecutar la imagen)

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/items` | Lista todos los productos |
| POST | `/items` | Crea un producto (`{"name": "Leche", "quantity": 2}`) |
| GET | `/items/:id` | Obtiene un producto |
| PUT | `/items/:id` | Edita `name`, `quantity` y/o `bought` |
| DELETE | `/items/:id` | Elimina un producto |

## Ejecutar con Docker

```bash
# 1. Construir la imagen
docker build -t lista-compras-api .

# 2. Ejecutar el contenedor mapeando el puerto 3000
docker run -d --name lista-compras -p 3000:3000 lista-compras-api

# 3. Probar
curl http://localhost:3000/health
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Leche", "quantity": 2}'
curl http://localhost:3000/items

# 4. Detener y eliminar el contenedor
docker rm -f lista-compras
```

## Ejecutar sin Docker

```bash
npm start      # http://localhost:3000
npm test       # corre los tests
```

El puerto se puede cambiar con la variable de entorno `PORT`.
