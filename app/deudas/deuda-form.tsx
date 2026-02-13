'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearDeuda, editarDeuda } from '@/app/actions/deudas-actions'
import { Deuda } from '@/app/lib/definitions'
import * as Label from '@radix-ui/react-label'

interface DeudaFormProps {
  deuda?: Deuda
}

export function DeudaForm({ deuda }: DeudaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    descripcion: deuda?.descripcion || '',
    monto: deuda?.monto || 0,
    tasa_interes_anual: deuda?.tasa_interes_anual || 0,
    pago_minimo: deuda?.pago_minimo || 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'descripcion' ? value : parseFloat(value) || 0
    }))
  }

  // Calcular interés mensual en dinero
  const interesMensual =
    formData.monto && formData.tasa_interes_anual
      ? (formData.monto * (formData.tasa_interes_anual / 100)) / 12
      : 0

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formElement = e.currentTarget
    const formDataObj = new FormData(formElement)

    const monto = parseFloat(formDataObj.get('monto') as string)
    const tasa = parseFloat(formDataObj.get('tasa_interes_anual') as string)
    const pago = parseFloat(formDataObj.get('pago_minimo') as string)
    const descripcion = formDataObj.get('descripcion') as string

    if (!descripcion.trim()) {
      setError('La descripción es requerida')
      return
    }

    if (isNaN(monto) || monto <= 0) {
      setError('El monto debe ser un número mayor a 0')
      return
    }

    if (isNaN(tasa) || tasa < 0 || tasa > 100) {
      setError('La tasa de interés debe estar entre 0 y 100')
      return
    }

    if (isNaN(pago) || pago <= 0) {
      setError('El pago mínimo debe ser un número mayor a 0')
      return
    }

    //importante  Validar que el pago mínimo sea mayor que el interés mensual o nunca terminamos de pagar la deuda
    const interesMensual = (monto * (tasa / 100)) / 12
    if (pago <= interesMensual) {
      setError(
        `El pago mínimo ($${pago.toFixed(2)}) debe ser mayor que el interés mensual ($${interesMensual.toFixed(2)})`
      )
      return
    }

    startTransition(async () => {
      try {
        if (deuda) {
          await editarDeuda(deuda.id, formDataObj)
        } else {
          await crearDeuda(formDataObj)
        }
        router.push('/deudas')
        router.refresh()
      } catch (err) {
        console.error('Error saving debt:', err)
        setError('Error al guardar la deuda. Por favor intenta de nuevo.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-700 font-medium'>⚠️ {error}</p>
        </div>
      )}

      <div>
        <Label.Root htmlFor='descripcion' className='block text-sm font-medium text-gray-700 mb-2'>
          Descripción de la Deuda *
        </Label.Root>
        <input
          type='text'
          id='descripcion'
          name='descripcion'
          value={formData.descripcion}
          onChange={handleInputChange}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder='Ej: Tarjeta de Crédito Bancomer'
          required
        />
      </div>

      <div>
        <Label.Root htmlFor='monto' className='block text-sm font-medium text-gray-700 mb-2'>
          Monto Adeudado *
        </Label.Root>
        <div className='relative'>
          <span className='absolute left-3 top-2 text-gray-500'>$</span>
          <input
            type='number'
            id='monto'
            name='monto'
            step='0.01'
            min='0.01'
            value={formData.monto || ''}
            onChange={handleInputChange}
            className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='15000.00'
            required
          />
        </div>
      </div>

      <div>
        <Label.Root
          htmlFor='tasa_interes_anual'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Tasa de Interés Anual *
        </Label.Root>
        <div className='relative'>
          <input
            type='number'
            id='tasa_interes_anual'
            name='tasa_interes_anual'
            step='0.01'
            min='0'
            max='100'
            value={formData.tasa_interes_anual || ''}
            onChange={handleInputChange}
            className='w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='36.00'
            required
          />
          <span className='absolute right-3 top-2 text-gray-500'>%</span>
        </div>
        <p className='text-sm text-gray-500 mt-1'>
          Tasa mensual:{' '}
          {formData.tasa_interes_anual ? (formData.tasa_interes_anual / 12).toFixed(2) : '0.00'}%
        </p>
      </div>

      <div>
        <Label.Root htmlFor='pago_minimo' className='block text-sm font-medium text-gray-700 mb-2'>
          Pago Mínimo Mensual *
        </Label.Root>
        <div className='relative'>
          <span className='absolute left-3 top-2 text-gray-500'>$</span>
          <input
            type='number'
            id='pago_minimo'
            name='pago_minimo'
            step='0.01'
            min='0.01'
            value={formData.pago_minimo || ''}
            onChange={handleInputChange}
            className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='500.00'
            required
          />
        </div>
        {interesMensual > 0 && (
          <p className='text-sm text-gray-500 mt-1'>
            💡 Interés mensual: ${interesMensual.toFixed(2)} (el pago mínimo debe ser mayor)
          </p>
        )}
      </div>

      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          disabled={isPending}
          className='flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isPending ? 'Guardando...' : deuda ? 'Actualizar Deuda' : 'Guardar Deuda'}
        </button>
        <button
          type='button'
          onClick={() => router.back()}
          className='flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors'
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
