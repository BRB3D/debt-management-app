import Link from 'next/link'
import { calcularResumenTotal } from '@/app/lib/deudas-data'
import * as Separator from '@radix-ui/react-separator'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ResumenPage() {
  const resumen = await calcularResumenTotal()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatMeses = (meses: number) => {
    const años = Math.floor(meses / 12)
    const mesesRestantes = meses % 12

    if (años === 0) {
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
    } else if (mesesRestantes === 0) {
      return `${años} ${años === 1 ? 'año' : 'años'}`
    } else {
      return `${años} ${años === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <Link
            href='/'
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
            Volver al Menú
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-4 text-center'>
            Resumen Total de Deudas
          </h1>

          <Separator.Root className='bg-gray-200 h-[1px] my-6' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-red-50 border-l-4 border-red-500 p-6 rounded-lg'>
              <div className='flex items-center gap-3 mb-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8 text-red-600'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <h2 className='text-lg font-semibold text-gray-700'>Total Adeudado</h2>
              </div>
              <p className='text-3xl font-bold text-red-600'>
                {formatCurrency(resumen.total_adeudado)}
              </p>
            </div>

            <div className='bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg'>
              <div className='flex items-center gap-3 mb-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8 text-orange-600'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941'
                  />
                </svg>
                <h2 className='text-lg font-semibold text-gray-700'>Intereses</h2>
              </div>
              <p className='text-3xl font-bold text-orange-600'>
                {formatCurrency(resumen.total_intereses)}
              </p>
            </div>

            <div className='bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg'>
              <div className='flex items-center gap-3 mb-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8 text-blue-600'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <h2 className='text-lg font-semibold text-gray-700'>Tiempo con Pago Mínimo</h2>
              </div>
              <p className='text-3xl font-bold text-blue-600'>
                {formatMeses(resumen.tiempo_pago_minimo)}
              </p>
            </div>

            <div className='bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg'>
              <div className='flex items-center gap-3 mb-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8 text-purple-600'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z'
                  />
                </svg>
                <h2 className='text-lg font-semibold text-gray-700'>Total a Pagar</h2>
              </div>
              <p className='text-3xl font-bold text-purple-600'>
                {formatCurrency(resumen.total_a_pagar)}
              </p>
            </div>
          </div>

          <Separator.Root className='bg-gray-200 h-[1px] my-8' />

          <div className='mt-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <div className='flex items-start gap-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6 text-yellow-600 flex-shrink-0 mt-1'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
                />
              </svg>
              <div>
                <h3 className='font-semibold text-yellow-800 mb-1'>Nota Importante</h3>
                <p className='text-sm text-yellow-700'>
                  Estos cálculos están basados en realizar únicamente el pago mínimo mensual. Pagar
                  más del mínimo reducirá significativamente el tiempo de pago y los intereses
                  totales.
                </p>
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-center gap-4'>
            <Link
              href='/deudas'
              className='inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white font-medium hover:bg-green-600 transition-colors'
            >
              Ver Lista de Deudas
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
                  d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
