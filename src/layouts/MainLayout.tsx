
import type { ReactNode } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

type MainLayoutProps = {
  children: ReactNode
  activePage?: string
}

export default function MainLayout({
  children,
  activePage = '/',
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header activePage={activePage} />

      <main className="w-full flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}
