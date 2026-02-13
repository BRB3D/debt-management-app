## Next.js App Router Course - Starter

Esto es un proyecto para la UVM llamado gestionador de deudas
Utiliza un método bidireccional para mantener datos, este método se basa mayormente en formatos primitivos (un JSON) este es el formato principal y puede conectarse con una db sql y las funciones CRUD funcionan perfecto sincronizando el JSON y la base de datos en caso de tenerla.

# Instrucciones para instalar

Checar que tenemos Node instalado (al ser requermimiento para poder usar la applicacion)
Checar que tenemos PNPM instalado de lo contrario lo podemos instalar de esta URL https://pnpm.io/installation
Si ya tenemos pnpm y node entonces podemos instalar la applicacion con solo `pnpm i`
Tambien si queremos usar sql podemos instalar sql y podemos seguir los pasos de sql para conectarnos y hacer seed de nuestra db
Una vez instalado para correr el projecto solo utiliza `pnpm run dev`

## Sql

para conectarse a SQL vamos a necesitar llenar los datos siguientes:
`POSTGRES_URL="postgres://<your Postgres username>:<your DB password>@127.0.0.1:5432/<nombre de la base de datos>"`
`POSTGRES_URL_NON_POOLING="postgres://<your Postgres username>:<your DB password>@127.0.0.1:5432/<nombre de la base de datos>"`
`POSTGRES_USER="<your Postgres username>"`
`POSTGRES_HOST="127.0.0.1"`
`POSTGRES_PASSWORD="<your DB password, leave as an empty double quoted string if none>"`
`POSTGRES_DATABASE="next-js-dashboard"`

Si no tienes un password para tu db simplemente usas este formato
`postgres://<your Postgres username>:@127.0.0.1:5432/<nombre de la base de datos>`

## Seed route

Tambien tenemos una seed route cuando ya conectamos la base de datos entonces podemso hacer un Seed para crear las tablas necesarias y estas son las mismas que usamos si no hay base de datos.
Simplemente corre el proyecto después de haber agregado la informacion necesaria de SQL y puedes usar
`http://localhost:3000/seed-deudas`

## Testing

Para hacer el testing estamos utilizando viTest ya que en mi epxeriencia es un poco mas sencillo que jest para applicaciones con nextJS.
`pnpm run test`
