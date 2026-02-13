'use client'

import { borrarDeuda } from '@/app/actions/deudas-actions'
import { useState, useTransition } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Toast from '@radix-ui/react-toast'

export function DeleteButton({ id, descripcion }: { id: number; descripcion: string }) {
  const [isPending, startTransition] = useTransition()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await borrarDeuda(id)
      if (result.success) {
        setToastMessage('Deuda eliminada exitosamente')
      } else {
        setToastMessage('Error al eliminar la deuda')
      }
      setShowToast(true)
    })
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className='inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition-colors'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
            />
          </svg>
          Eliminar
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className='fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <AlertDialog.Content className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-lg shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'>
          <AlertDialog.Title className='text-xl font-semibold text-gray-900 mb-2'>
            ¿Eliminar deuda?
          </AlertDialog.Title>
          <AlertDialog.Description className='text-gray-600 mb-6'>
            ¿Estás seguro de que deseas eliminar la deuda "{descripcion}"? Esta acción no se puede
            deshacer.
          </AlertDialog.Description>
          <div className='flex gap-3 justify-end'>
            <AlertDialog.Cancel asChild>
              <button className='px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'>
                Cancelar
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className='px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>

      <Toast.Root
        open={showToast}
        onOpenChange={setShowToast}
        className='bg-white rounded-lg shadow-lg p-4 border border-gray-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full'
      >
        <Toast.Title className='font-semibold text-gray-900'>{toastMessage}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className='fixed top-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-full m-0 list-none z-50' />
    </AlertDialog.Root>
  )
}
