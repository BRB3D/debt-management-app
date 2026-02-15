# Gestionador de Deudas (UVM)

Proyecto desarrollado con Next.js App Router. Implementa un sistema de persistencia bidireccional: utiliza JSON como fuente principal de datos con capacidad de sincronización a una base de datos SQL (PostgreSQL). Soporta operaciones CRUD completas manteniendo consistencia entre el JSON y la base de datos (si está configurada).

## Prerrequisitos

* **Node.js**: [Descargar](https://nodejs.org/es)
* **PNPM**: [Instrucciones de instalación](https://pnpm.io/installation)

## Instalación

1. **Verificar herramientas instaladas:**
    Ejecutar los siguientes comandos. Si devuelven un número de versión, están listos.
    ```bash
    node -v
    pnpm -v
    ```
2. **Clonar el repositorio:**
    ```bash
    git clone https://github.com/BRB3D/debt-management-app.git
    ```
3. **Instalar dependencias:**
    Acceder al directorio e instalar.
    ```bash
    cd debt-management-app
    pnpm i
    ```

## Configuración SQL (Opcional)

Para habilitar la persistencia en base de datos, configurar las variables en el archivo `.env`.

```typescript
POSTGRES_URL="postgres://<usuario>:<password>@127.0.0.1:5432/<nombre_db>"
POSTGRES_URL_NON_POOLING="postgres://<usuario>:<password>@127.0.0.1:5432/<nombre_db>"
POSTGRES_USER="<usuario>"
POSTGRES_HOST="127.0.0.1"
POSTGRES_PASSWORD="<password>"
POSTGRES_DATABASE="<nombre_db>"
```

*Nota: Si la base de datos no tiene contraseña, el formato de la URL debe ser: `postgres://<usuario>:@127.0.0.1:5432/<nombre_db>`*

## Seed (Poblado de datos)

Una vez configurada la conexión SQL y con el servidor en ejecución, visitar la siguiente ruta para crear las tablas necesarias y poblar datos iniciales: `http://localhost:3000/seed-deudas`

## Testing

El proyecto utiliza ``Vitest`` para las pruebas unitarias.

```bash 
pnpm run test
```