import Link from 'next/link'
import AcmeLogo from '@/app/ui/acme-logo'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100'>
      <div className='flex flex-col items-center gap-8 max-w-2xl w-full'>
        <div className='flex items-center gap-4'>
          <AcmeLogo />
          <h1 className='text-4xl font-bold text-gray-800'>Gestor de Deudas</h1>
        </div>

        <div className='bg-white rounded-lg shadow-xl p-8 w-full'>
          <h2 className='text-2xl font-semibold text-center mb-8 text-gray-700'>Menú Principal</h2>

          <div className='flex flex-col gap-4'>
            <Link
              href='/resumen'
              className='flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
                />
              </svg>
              Resumen Total de Deudas
            </Link>

            <Link
              href='/deudas'
              className='flex items-center justify-center gap-3 rounded-lg bg-green-500 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                />
              </svg>
              Lista de Deudas
            </Link>
          </div>
        </div>

        <p className='text-sm text-gray-600 text-center'>
          Sistema de gestión de deudas - Calcula proyecciones y administra tus pagos
        </p>
      </div>
    </main>
  )
}
