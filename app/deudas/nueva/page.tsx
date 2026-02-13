import { DeudaForm } from '../deuda-form'
import Link from 'next/link'

export default function NuevaDeudaPage() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <Link
            href='/deudas'
            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
              />
            </svg>
            Volver a Lista de Deudas
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Agregar Nueva Deuda</h1>
          <DeudaForm />
        </div>
      </div>
    </main>
  )
}
