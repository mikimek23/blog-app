import React from 'react'

export const Home = () => {
  return (
    <div>
      <section className='text-center py-12'>
        <h1 className='text-5xl md:text-7xl font-black text-slate-900 leading-tight'>
          Insights for the{' '}
          <span className='text-blue-600 underline decoration-blue-100 underline-offset-8'>
            modern
          </span>{' '}
          dev.
        </h1>
        <p className='mt-6 text-xl text-slate-500 max-w-2xl mx-auto'>
          Discover the latest trends in UI/UX, software architecture, and the
          future of the web.
        </p>
      </section>
    </div>
  )
}
