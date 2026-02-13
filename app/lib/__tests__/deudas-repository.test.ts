import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DeudasRepository } from '../deudas-repository'
import fs from 'fs/promises'
import path from 'path'

// Mock del pool de PostgreSQL para que no intente conectarse
vi.mock('../../../db', () => ({
  default: {
    query: vi.fn().mockRejectedValue(new Error('PostgreSQL not available in tests'))
  }
}))

const TEST_JSON_PATH = path.join(process.cwd(), 'data', 'deudas-test.json')

describe('DeudasRepository - Operaciones CRUD con JSON', () => {
  // Antes de cada test, limpiar el archivo de prueba
  beforeEach(async () => {
    await fs.writeFile(TEST_JSON_PATH, JSON.stringify([]), 'utf-8')
  })

  afterEach(async () => {
    try {
      await fs.unlink(TEST_JSON_PATH)
    } catch (error) {}
  })

  describe('CREATE - registrar()', () => {
    it('debe crear una nueva deuda con ID 1 cuando el array está vacío', async () => {
      const deuda = await DeudasRepository.registrar(
        'Tarjeta de Crédito',
        15000,
        36,
        500,
        TEST_JSON_PATH
      )

      expect(deuda).toMatchObject({
        id: 1,
        descripcion: 'Tarjeta de Crédito',
        monto: 15000,
        tasa_interes_anual: 36,
        pago_minimo: 500
      })
      expect(deuda.created_at).toBeInstanceOf(Date)
    })

    it('debe incrementar el ID automáticamente', async () => {
      const deuda1 = await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      const deuda2 = await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)
      const deuda3 = await DeudasRepository.registrar('Deuda 3', 3000, 30, 300, TEST_JSON_PATH)

      expect(deuda1.id).toBe(1)
      expect(deuda2.id).toBe(2)
      expect(deuda3.id).toBe(3)
    })

    it('debe usar push() para agregar al array', async () => {
      await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)

      const deudas = await DeudasRepository.obtenerTodas(TEST_JSON_PATH)
      expect(deudas).toHaveLength(2)
    })
  })

  describe('READ - obtenerTodas() y obtenerPorId()', () => {
    it('debe retornar array vacío cuando no hay deudas', async () => {
      const deudas = await DeudasRepository.obtenerTodas(TEST_JSON_PATH)
      expect(deudas).toEqual([])
    })

    it('debe retornar todas las deudas ordenadas por ID descendente', async () => {
      await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 3', 3000, 30, 300, TEST_JSON_PATH)

      const deudas = await DeudasRepository.obtenerTodas(TEST_JSON_PATH)

      expect(deudas).toHaveLength(3)
      expect(deudas[0].id).toBe(3)
      expect(deudas[1].id).toBe(2)
      expect(deudas[2].id).toBe(1)
    })

    it('debe usar find() para obtener por ID', async () => {
      await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 3', 3000, 30, 300, TEST_JSON_PATH)

      const encontrada = await DeudasRepository.obtenerPorId(2, TEST_JSON_PATH)

      expect(encontrada).toMatchObject({
        id: 2,
        descripcion: 'Deuda 2',
        monto: 2000
      })
    })

    it('debe retornar null si no encuentra el ID', async () => {
      const deuda = await DeudasRepository.obtenerPorId(999, TEST_JSON_PATH)
      expect(deuda).toBeNull()
    })
  })

  describe('UPDATE - actualizar()', () => {
    it('debe actualizar una deuda existente usando findIndex()', async () => {
      const original = await DeudasRepository.registrar('Original', 1000, 10, 100, TEST_JSON_PATH)

      const actualizada = await DeudasRepository.actualizar(
        original.id,
        'Actualizada',
        2000,
        20,
        200,
        TEST_JSON_PATH
      )

      expect(actualizada).toMatchObject({
        id: original.id,
        descripcion: 'Actualizada',
        monto: 2000,
        tasa_interes_anual: 20,
        pago_minimo: 200
      })
    })

    it('debe mantener el ID original después de actualizar', async () => {
      const deuda = await DeudasRepository.registrar('Deuda', 1000, 10, 100, TEST_JSON_PATH)
      const idOriginal = deuda.id

      await DeudasRepository.actualizar(idOriginal, 'Modificada', 5000, 50, 500, TEST_JSON_PATH)

      const verificada = await DeudasRepository.obtenerPorId(idOriginal, TEST_JSON_PATH)
      expect(verificada?.id).toBe(idOriginal)
    })

    it('debe lanzar error si la deuda no existe', async () => {
      await expect(
        DeudasRepository.actualizar(999, 'No existe', 1000, 10, 100, TEST_JSON_PATH)
      ).rejects.toThrow('Deuda no encontrada')
    })
  })

  describe('DELETE - eliminar()', () => {
    it('debe eliminar una deuda usando filter()', async () => {
      await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      const deuda2 = await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 3', 3000, 30, 300, TEST_JSON_PATH)

      await DeudasRepository.eliminar(deuda2.id, TEST_JSON_PATH)

      const deudas = await DeudasRepository.obtenerTodas(TEST_JSON_PATH)
      expect(deudas).toHaveLength(2)
      expect(deudas.find((d) => d.id === deuda2.id)).toBeUndefined()
    })

    it('debe mantener las demás deudas después de eliminar', async () => {
      const deuda1 = await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)
      const deuda3 = await DeudasRepository.registrar('Deuda 3', 3000, 30, 300, TEST_JSON_PATH)

      await DeudasRepository.eliminar(2, TEST_JSON_PATH)

      const deudas = await DeudasRepository.obtenerTodas(TEST_JSON_PATH)
      expect(deudas).toHaveLength(2)
      expect(deudas.find((d) => d.id === deuda1.id)).toBeDefined()
      expect(deudas.find((d) => d.id === deuda3.id)).toBeDefined()
    })

    it('no debe fallar al eliminar un ID que no existe', async () => {
      await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)

      await expect(DeudasRepository.eliminar(999, TEST_JSON_PATH)).resolves.not.toThrow()
    })
  })

  describe('Métodos de Array utilizados', () => {
    it('debe usar Math.max() y map() para calcular el siguiente ID', async () => {
      await DeudasRepository.registrar('Deuda 1', 1000, 10, 100, TEST_JSON_PATH)
      await DeudasRepository.registrar('Deuda 2', 2000, 20, 200, TEST_JSON_PATH)

      await DeudasRepository.eliminar(2, TEST_JSON_PATH)

      const nuevaDeuda = await DeudasRepository.registrar('Deuda 3', 3000, 30, 300, TEST_JSON_PATH)
      expect(nuevaDeuda.id).toBe(2)
    })

    it('debe usar sort() para ordenar las deudas', async () => {
      await DeudasRepository.registrar('Primera', 1000, 10, 100, TEST_JSON_PATH)
      await DeudasRepository.registrar('Segunda', 2000, 20, 200, TEST_JSON_PATH)
      await DeudasRepository.registrar('Tercera', 3000, 30, 300, TEST_JSON_PATH)

      const deudas = await DeudasRepository.obtenerTodas(TEST_JSON_PATH)

      // Verificar que está ordenado descendente
      for (let i = 0; i < deudas.length - 1; i++) {
        expect(deudas[i].id).toBeGreaterThan(deudas[i + 1].id)
      }
    })
  })
})
