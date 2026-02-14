import { Deuda } from './definitions'
import pool from '../../db'
import fs from 'fs/promises'
import path from 'path'

// Ruta del archivo JSON por defecto para producción tenemos uno differente para test
const DEFAULT_JSON_PATH = path.join(process.cwd(), 'data', 'deudas.json')

// Detectar si estamos en producción (Vercel u otro hosting)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Helper para convertir tipos de PostgreSQL a JavaScript ya que en produccion no aparecia el resumen
function parseDeudaFromDB(row: any): Deuda {
  return {
    ...row,
    monto: parseFloat(row.monto),
    tasa_interes_anual: parseFloat(row.tasa_interes_anual),
    pago_minimo: parseFloat(row.pago_minimo),
    created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at)
  }
}

// --- FUNCIONES EXPORTADAS PARA JSON (REUTILIZABLES EN TESTS) ---
/**
 * Aqui tenemos las operaciones basicas CRUD para nuestra aplicaccion.
 * este repositorio combina la utilizacion de métodos para trabajar con un formato de estructuras basicas
 * y también para poder insertar a una base de datos local o external SQL
 * FS es utilizado para leer y escribir en archivos (proporcionado por Node)
 * esta separado en dos la Primer parte son las funciones basicas que necesitamos para escribir y leer sin SQL
 */

export async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function readJSONData(filePath: string): Promise<Deuda[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // Si el archivo no existe, retornar array vacío para que no haga crash la aplicación
    return []
  }
}

export async function writeJSONData(filePath: string, deudas: Deuda[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(filePath, JSON.stringify(deudas, null, 2), 'utf-8')
}

export function getNextId(deudas: Deuda[]): number {
  if (deudas.length === 0) return 1
  return Math.max(...deudas.map((d) => d.id)) + 1
}

/** --- FUNCIONES PARA SINCRONIZAR CON POSTGRESQL (OPCIONAL) ---
 * En caso de tener Postgres estas son las funciones extra que realizamos para que se pueda insertar a la base de datos de sql
 *
 * */

async function syncToPostgres(operation: string, data: any): Promise<void> {
  try {
    switch (operation) {
      case 'INSERT':
        await pool.query(
          `INSERT INTO deudas (id, descripcion, monto, tasa_interes_anual, pago_minimo, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             descripcion = EXCLUDED.descripcion,
             monto = EXCLUDED.monto,
             tasa_interes_anual = EXCLUDED.tasa_interes_anual,
             pago_minimo = EXCLUDED.pago_minimo`,
          [
            data.id,
            data.descripcion,
            data.monto,
            data.tasa_interes_anual,
            data.pago_minimo,
            data.created_at
          ]
        )
        break

      case 'UPDATE':
        await pool.query(
          `UPDATE deudas
           SET descripcion = $1, monto = $2, tasa_interes_anual = $3, pago_minimo = $4
           WHERE id = $5`,
          [data.descripcion, data.monto, data.tasa_interes_anual, data.pago_minimo, data.id]
        )
        break

      case 'DELETE':
        await pool.query('DELETE FROM deudas WHERE id = $1', [data.id])
        break
    }
  } catch (error) {
    // PostgreSQL no disponible o falló - no es crítico y no hacemos crash de la applicacion ya que todo esta guardado tambien en un archivo JSON
    console.log(
      `PostgreSQL sync failed for ${operation}:`,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

// --- REPOSITORY INTERFACE (JSON PRIMERO, POSTGRES SECUNDARIO) ---

export const DeudasRepository = {
  async registrar(
    descripcion: string,
    monto: number,
    tasaInteresAnual: number,
    pagoMinimo: number,
    filePath: string = DEFAULT_JSON_PATH
  ): Promise<Deuda> {
    // PRODUCCIÓN: Solo PostgreSQL
    if (isProduction && filePath === DEFAULT_JSON_PATH) {
      const client = await pool.connect()
      try {
        const result = await client.query(
          `INSERT INTO deudas (descripcion, monto, tasa_interes_anual, pago_minimo, created_at)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [descripcion, monto, tasaInteresAnual, pagoMinimo, new Date()]
        )
        return parseDeudaFromDB(result.rows[0])
      } finally {
        client.release()
      }
    }

    // LOCAL/TESTS: JSON primero, luego sync a PostgreSQL
    const deudas = await readJSONData(filePath)
    const nuevaDeuda: Deuda = {
      id: getNextId(deudas),
      descripcion,
      monto,
      tasa_interes_anual: tasaInteresAnual,
      pago_minimo: pagoMinimo,
      created_at: new Date()
    }
    deudas.push(nuevaDeuda)
    await writeJSONData(filePath, deudas)

    // Sincronizar con PostgreSQL si es el archivo por defecto
    if (filePath === DEFAULT_JSON_PATH) {
      await syncToPostgres('INSERT', nuevaDeuda)
    }

    return nuevaDeuda
  },

  async obtenerTodas(filePath: string = DEFAULT_JSON_PATH): Promise<Deuda[]> {
    // PRODUCCIÓN: Solo PostgreSQL
    if (isProduction && filePath === DEFAULT_JSON_PATH) {
      const client = await pool.connect()
      try {
        const result = await client.query('SELECT * FROM deudas ORDER BY id DESC')
        return result.rows.map(parseDeudaFromDB)
      } finally {
        client.release()
      }
    }

    // LOCAL
    const deudas = await readJSONData(filePath)
    return deudas.sort((a, b) => b.id - a.id)
  },

  async obtenerPorId(id: number, filePath: string = DEFAULT_JSON_PATH): Promise<Deuda | null> {
    // PRODUCCIÓN: Solo PostgreSQL
    if (isProduction && filePath === DEFAULT_JSON_PATH) {
      const client = await pool.connect()
      try {
        const result = await client.query('SELECT * FROM deudas WHERE id = $1', [id])
        return result.rows[0] ? parseDeudaFromDB(result.rows[0]) : null
      } finally {
        client.release()
      }
    }

    // LOCAL
    const deudas = await readJSONData(filePath)
    return deudas.find((d) => d.id === id) || null
  },

  async actualizar(
    id: number,
    descripcion: string,
    monto: number,
    tasaInteresAnual: number,
    pagoMinimo: number,
    filePath: string = DEFAULT_JSON_PATH
  ): Promise<Deuda> {
    // PRODUCCIÓN: Solo PostgreSQL
    if (isProduction && filePath === DEFAULT_JSON_PATH) {
      const client = await pool.connect()
      try {
        const result = await client.query(
          `UPDATE deudas
           SET descripcion = $1, monto = $2, tasa_interes_anual = $3, pago_minimo = $4
           WHERE id = $5
           RETURNING *`,
          [descripcion, monto, tasaInteresAnual, pagoMinimo, id]
        )
        if (result.rows.length === 0) {
          throw new Error('Deuda no encontrada')
        }
        return parseDeudaFromDB(result.rows[0])
      } finally {
        client.release()
      }
    }

    // LOCAL: JSON primero, luego sync a PostgreSQL
    const deudas = await readJSONData(filePath)
    const index = deudas.findIndex((d) => d.id === id)
    if (index === -1) {
      throw new Error('Deuda no encontrada')
    }

    deudas[index] = {
      ...deudas[index],
      descripcion,
      monto,
      tasa_interes_anual: tasaInteresAnual,
      pago_minimo: pagoMinimo
    }

    await writeJSONData(filePath, deudas)

    if (filePath === DEFAULT_JSON_PATH) {
      await syncToPostgres('UPDATE', deudas[index])
    }

    return deudas[index]
  },

  async eliminar(id: number, filePath: string = DEFAULT_JSON_PATH): Promise<void> {
    // PRODUCCIÓN: Solo PostgreSQL
    if (isProduction && filePath === DEFAULT_JSON_PATH) {
      const client = await pool.connect()
      try {
        await client.query('DELETE FROM deudas WHERE id = $1', [id])
      } finally {
        client.release()
      }
      return
    }

    // LOCAL: JSON primero, luego sync a PostgreSQL
    const deudas = await readJSONData(filePath)
    const filteredDeudas = deudas.filter((d) => d.id !== id)
    await writeJSONData(filePath, filteredDeudas)

    if (filePath === DEFAULT_JSON_PATH) {
      await syncToPostgres('DELETE', { id })
    }
  }
}
