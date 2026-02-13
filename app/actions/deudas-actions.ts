'use server'

import { revalidatePath } from 'next/cache'
import {
  registrarDeuda as registrarDeudaDB,
  actualizarDeuda as actualizarDeudaDB,
  eliminarDeuda as eliminarDeudaDB
} from '@/app/lib/deudas-data'

/**
 *
 * Modulo con funciones para la forma donde tenemos la creacion de deudas o la edicion de deudas.
 */
export async function crearDeuda(formData: FormData) {
  const descripcion = formData.get('descripcion') as string
  const monto = parseFloat(formData.get('monto') as string)
  const tasaInteresAnual = parseFloat(formData.get('tasa_interes_anual') as string)
  const pagoMinimo = parseFloat(formData.get('pago_minimo') as string)

  try {
    await registrarDeudaDB(descripcion, monto, tasaInteresAnual, pagoMinimo)
    revalidatePath('/deudas')
  } catch (error) {
    console.error('Error creating debt:', error)
    throw new Error('Failed to create debt')
  }
}

export async function editarDeuda(id: number, formData: FormData) {
  const descripcion = formData.get('descripcion') as string
  const monto = parseFloat(formData.get('monto') as string)
  const tasaInteresAnual = parseFloat(formData.get('tasa_interes_anual') as string)
  const pagoMinimo = parseFloat(formData.get('pago_minimo') as string)

  try {
    await actualizarDeudaDB(id, descripcion, monto, tasaInteresAnual, pagoMinimo)
    revalidatePath('/deudas')
  } catch (error) {
    console.error('Error updating debt:', error)
    throw new Error('Failed to update debt')
  }
}

export async function borrarDeuda(id: number) {
  try {
    await eliminarDeudaDB(id)
    revalidatePath('/deudas')
    return { success: true }
  } catch (error) {
    console.error('Error deleting debt:', error)
    return { success: false, error: 'Failed to delete debt' }
  }
}
