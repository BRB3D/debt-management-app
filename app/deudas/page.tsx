import Link from 'next/link'
import { obtenerDeudas, calcularProyeccion } from '@/app/lib/deudas-data'
import { DeleteButton } from './delete-button'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DeudasPage() {
  const deudas = await obtenerDeudas()

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
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6 flex items-center justify-between'>
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

          <Link
            href='/deudas/nueva'
            className='inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white font-medium hover:bg-green-600 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Agregar Deuda
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Lista de Deudas</h1>

          {deudas.length === 0 ? (
            <div className='text-center py-12'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-16 h-16 mx-auto text-gray-400 mb-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
                />
              </svg>
              <p className='text-gray-600 text-lg mb-4'>No hay deudas registradas</p>
              <Link
                href='/deudas/nueva'
                className='inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white font-medium hover:bg-green-600 transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                </svg>
                Agregar Primera Deuda
              </Link>
            </div>
          ) : (
            <div className='space-y-4'>
              {deudas.map((deuda) => {
                const proyeccion = calcularProyeccion(deuda)
                return (
                  <div
                    key={deuda.id}
                    className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-semibold text-gray-800'>{deuda.descripcion}</h3>
                        <p className='text-sm text-gray-500 mt-1'>ID: {deuda.id}</p>
                      </div>
                      <div className='flex gap-2'>
                        <Link
                          href={`/deudas/${deuda.id}/editar`}
                          className='inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 transition-colors'
                        >
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
                              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                            />
                          </svg>
                          Editar
                        </Link>
                        <DeleteButton id={deuda.id} descripcion={deuda.descripcion} />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                      <div>
                        <p className='text-sm text-gray-600'>Monto</p>
                        <p className='text-lg font-semibold text-gray-800'>
                          {formatCurrency(deuda.monto)}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Tasa Anual</p>
                        <p className='text-lg font-semibold text-gray-800'>
                          {deuda.tasa_interes_anual}%
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Pago Mínimo</p>
                        <p className='text-lg font-semibold text-gray-800'>
                          {formatCurrency(deuda.pago_minimo)}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Interés Mensual</p>
                        <p className='text-lg font-semibold text-gray-800'>
                          {(deuda.tasa_interes_anual / 12).toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    {proyeccion.error ? (
                      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <p className='text-red-700 font-medium'>⚠️ {proyeccion.error}</p>
                      </div>
                    ) : (
                      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                        <p className='text-sm text-blue-800 mb-2 font-medium'>
                          Proyección con pago mínimo:
                        </p>
                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div>
                            <p className='text-blue-600'>Tiempo de pago</p>
                            <p className='font-semibold text-blue-900'>
                              {formatMeses(proyeccion.meses)}
                            </p>
                          </div>
                          <div>
                            <p className='text-blue-600'>Intereses totales</p>
                            <p className='font-semibold text-blue-900'>
                              {formatCurrency(proyeccion.total_intereses)}
                            </p>
                          </div>
                          <div>
                            <p className='text-blue-600'>Total a pagar</p>
                            <p className='font-semibold text-blue-900'>
                              {formatCurrency(proyeccion.total_a_pagar)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
