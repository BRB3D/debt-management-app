import { Deuda, ProyeccionDeuda, ResumenTotal } from './definitions'
import { DeudasRepository } from './deudas-repository'

/**
 * Registra una nueva deuda en el sistema.
 * @param descripcion Descripción de la deuda.
 * @param monto Monto total de la deuda.
 * @param tasaInteresAnual Tasa de interés anual (en porcentaje).
 * @param pagoMinimo Pago mínimo mensual.
 * @returns La deuda creada.
 */
export async function registrarDeuda(
  descripcion: string,
  monto: number,
  tasaInteresAnual: number,
  pagoMinimo: number
): Promise<Deuda> {
  try {
    return await DeudasRepository.registrar(descripcion, monto, tasaInteresAnual, pagoMinimo)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to register debt.')
  }
}

/**
 * Obtiene todas las deudas registradas.
 * @returns Un array con todas las deudas.
 */
export async function obtenerDeudas(): Promise<Deuda[]> {
  try {
    return await DeudasRepository.obtenerTodas()
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch debts.')
  }
}

/**
 * Obtiene una deuda específica por su ID.
 * @param id El ID de la deuda a buscar.
 * @returns La deuda encontrada o null si no existe.
 */
export async function obtenerDeudaPorId(id: number): Promise<Deuda | null> {
  try {
    return await DeudasRepository.obtenerPorId(id)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch debt.')
  }
}

/**
 * Actualiza los datos de una deuda existente.
 * @param id El ID de la deuda a actualizar.
 * @param descripcion Nueva descripción.
 * @param monto Nuevo monto.
 * @param tasaInteresAnual Nueva tasa de interés anual.
 * @param pagoMinimo Nuevo pago mínimo.
 * @returns La deuda actualizada.
 */
export async function actualizarDeuda(
  id: number,
  descripcion: string,
  monto: number,
  tasaInteresAnual: number,
  pagoMinimo: number
): Promise<Deuda> {
  try {
    return await DeudasRepository.actualizar(id, descripcion, monto, tasaInteresAnual, pagoMinimo)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to update debt.')
  }
}

/**
 * Elimina una deuda del sistema.
 * @param id El ID de la deuda a eliminar.
 */
export async function eliminarDeuda(id: number): Promise<void> {
  try {
    await DeudasRepository.eliminar(id)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to delete debt.')
  }
}

// --- MÓDULO DE CÁLCULOS (LÓGICA DE NEGOCIO) ---

/**
 * Calcula la proyección de pago de una deuda individual.
 * Determina cuántos meses tomará pagar la deuda y el total de intereses,
 * asumiendo que solo se realizan los pagos mínimos.
 * @param deuda La deuda a proyectar.
 * @returns Objeto con la proyección (meses, intereses, total) o un error si el pago no cubre los intereses.
 */
export function calcularProyeccion(deuda: Deuda): ProyeccionDeuda {
  let saldo = deuda.monto
  let meses = 0
  let totalIntereses = 0
  const interesMensual = deuda.tasa_interes_anual / 100 / 12

  // Validación: el pago mínimo debe ser mayor que el interés mensual inicial
  const interesInicial = saldo * interesMensual
  if (deuda.pago_minimo <= interesInicial) {
    return {
      meses: 0,
      total_intereses: 0,
      total_a_pagar: 0,
      error: 'Error: El pago mínimo no reduce la deuda'
    }
  }

  // Límite de 100 años
  while (saldo > 0 && meses < 1200) {
    const cuotaInteres = saldo * interesMensual
    saldo = saldo + cuotaInteres - deuda.pago_minimo
    totalIntereses += cuotaInteres
    meses++

    // Si el saldo es muy pequeño, considerarlo pagado
    if (saldo < 0.01) {
      saldo = 0
    }
  }

  return {
    meses,
    total_intereses: totalIntereses,
    total_a_pagar: deuda.monto + totalIntereses
  }
}

/**
 * Calcula un resumen total de todas las deudas registradas.
 * Incluye el total adeudado, total de intereses proyectados y el tiempo máximo de pago.
 * @returns Objeto con el resumen total.
 */
export async function calcularResumenTotal(): Promise<ResumenTotal> {
  try {
    const deudas = await obtenerDeudas()

    let totalAdeudado = 0
    let totalIntereses = 0
    let tiempoPagoMaximo = 0

    for (const deuda of deudas) {
      totalAdeudado += deuda.monto
      const proyeccion = calcularProyeccion(deuda)

      if (proyeccion.error) {
        continue // Saltar deudas con error para que nuestra app no se rompa
      }

      totalIntereses += proyeccion.total_intereses
      if (proyeccion.meses > tiempoPagoMaximo) {
        tiempoPagoMaximo = proyeccion.meses
      }
    }

    return {
      total_adeudado: totalAdeudado,
      total_intereses: totalIntereses,
      tiempo_pago_minimo: tiempoPagoMaximo,
      total_a_pagar: totalAdeudado + totalIntereses
    }
  } catch (error) {
    console.error('Error calculating summary:', error)
    throw new Error('Failed to calculate debt summary.')
  }
}
