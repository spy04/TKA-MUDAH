import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './auth/AuthProvider'
import { GuestRoute, ProtectedRoute } from './auth/RouteGuards'
import MainLayout from './layouts/MainLayout'
import Beranda from './pages/Beranda'
import DashboardSiswa from './pages/DashboardSiswa'
import JelajahiMateri from './pages/JelajahiMateri'
import DetailMateri from './pages/DetailMateri'
import RuangBelajar from './pages/RuangBelajar'
import SimulasiUjian from './pages/SimulasiUjian'
import HasilLatihan from './pages/HasilLatihan'
import LatihanSoal from './pages/LatihanSoal'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from "./pages/LandingPage";

function protectedLayout(
  activePage: string,
  children: ReactNode
) {
  return (
    <ProtectedRoute>
      <MainLayout activePage={activePage}>{children}</MainLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

<Route
  path="/beranda"
  element={protectedLayout('/beranda', <Beranda />)}
/>
          <Route
            path="/dashboard"
            element={protectedLayout('', <DashboardSiswa />)}
          />
          <Route
            path="/materi"
            element={
              <MainLayout activePage="/materi">
                <JelajahiMateri />
              </MainLayout>
            }
          />
          <Route
            path="/materi/:slug"
            element={
              <MainLayout activePage="/materi">
                <DetailMateri />
              </MainLayout>
            }
          />
          <Route
            path="/belajar/:slug"
            element={protectedLayout(
              '/materi',
              <RuangBelajar />
            )}
          />
          <Route
            path="/ujian/simulasi/:packageId"
            element={protectedLayout(
              '/latihan',
              <SimulasiUjian />
            )}
          />
          <Route
            path="/latihan/hasil/:attemptId"
            element={protectedLayout(
              '/latihan',
              <HasilLatihan />
            )}
          />
          <Route
            path="/latihan"
            element={
              <MainLayout activePage="/latihan">
                <LatihanSoal />
              </MainLayout>
            }
          />
          <Route
            path="/ujian"
            element={<Navigate to="/latihan?kind=SIMULATION" replace />}
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="*"
            element={
              <MainLayout>
                <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                  <h1 className="font-heading text-2xl font-bold text-brand">
                    Halaman belum tersedia
                  </h1>
                  <p className="mt-2 text-sm text-foreground-muted">
                    Halaman ini belum diimplementasikan.
                  </p>
                </div>
              </MainLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

