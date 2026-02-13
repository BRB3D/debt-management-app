import { Deuda, ProyeccionDeuda, ResumenTotal } from './definitions'
import { DeudasRepository } from './deudas-repository'

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

export async function obtenerDeudas(): Promise<Deuda[]> {
  try {
    return await DeudasRepository.obtenerTodas()
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch debts.')
  }
}

export async function obtenerDeudaPorId(id: number): Promise<Deuda | null> {
  try {
    return await DeudasRepository.obtenerPorId(id)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch debt.')
  }
}

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

export async function eliminarDeuda(id: number): Promise<void> {
  try {
    await DeudasRepository.eliminar(id)
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to delete debt.')
  }
}

// --- MÓDULO DE CÁLCULOS (LÓGICA DE NEGOCIO) ---

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
