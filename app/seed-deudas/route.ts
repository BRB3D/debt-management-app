import pool from '../../db'

async function createDeudasTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deudas (
      id INTEGER PRIMARY KEY,
      descripcion VARCHAR(255) NOT NULL,
      monto DECIMAL(10, 2) NOT NULL,
      tasa_interes_anual DECIMAL(5, 2) NOT NULL,
      pago_minimo DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function seedSampleDeudas() {
  const sampleDeudas = [
    {
      id: 1,
      descripcion: 'Tarjeta de Crédito Bancomer',
      monto: 15000,
      tasa: 36.0,
      pago: 500
    },
    {
      id: 2,
      descripcion: 'Préstamo Personal',
      monto: 50000,
      tasa: 18.0,
      pago: 2000
    },
    {
      id: 3,
      descripcion: 'Tarjeta Liverpool',
      monto: 8000,
      tasa: 42.0,
      pago: 400
    }
  ]

  for (const deuda of sampleDeudas) {
    await pool.query(
      `
      INSERT INTO deudas (id, descripcion, monto, tasa_interes_anual, pago_minimo)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
      `,
      [deuda.id, deuda.descripcion, deuda.monto, deuda.tasa, deuda.pago]
    )
  }
}

export async function GET() {
  try {
    await createDeudasTable()
    await seedSampleDeudas()

    return Response.json({ message: 'Tabla de deudas creada y datos de ejemplo insertados' })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error }, { status: 500 })
  }
}
