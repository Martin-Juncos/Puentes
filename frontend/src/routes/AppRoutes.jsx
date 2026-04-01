import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { RequireAuth } from '@/routes/RequireAuth'
import { RoleGate } from '@/routes/RoleGate'

const lazyModuleExport = (loader, exportName) =>
  lazy(async () => {
    const module = await loader()

    return {
      default: module[exportName],
    }
  })

const PublicLayout = lazyModuleExport(() => import('@/layouts/PublicLayout'), 'PublicLayout')
const PrivateLayout = lazyModuleExport(() => import('@/layouts/PrivateLayout'), 'PrivateLayout')
const AboutPage = lazyModuleExport(() => import('@/pages/public/AboutPage'), 'AboutPage')
const ApproachPage = lazyModuleExport(() => import('@/pages/public/ApproachPage'), 'ApproachPage')
const ContactPage = lazyModuleExport(() => import('@/pages/public/ContactPage'), 'ContactPage')
const HomePage = lazyModuleExport(() => import('@/pages/public/HomePage'), 'HomePage')
const NewsPage = lazyModuleExport(() => import('@/pages/public/NewsPage'), 'NewsPage')
const ServicesPage = lazyModuleExport(() => import('@/pages/public/ServicesPage'), 'ServicesPage')
const TeamPage = lazyModuleExport(() => import('@/pages/public/TeamPage'), 'TeamPage')
const LoginPage = lazyModuleExport(() => import('@/pages/auth/LoginPage'), 'LoginPage')
const AgendaPage = lazyModuleExport(() => import('@/pages/private/AgendaPage'), 'AgendaPage')
const ChildrenPage = lazyModuleExport(() => import('@/pages/private/ChildrenPage'), 'ChildrenPage')
const DashboardPage = lazyModuleExport(() => import('@/pages/private/DashboardPage'), 'DashboardPage')
const FamiliesPage = lazyModuleExport(() => import('@/pages/private/FamiliesPage'), 'FamiliesPage')
const FollowUpReportPage = lazyModuleExport(
  () => import('@/pages/private/FollowUpReportPage'),
  'FollowUpReportPage',
)
const FollowUpsPage = lazyModuleExport(() => import('@/pages/private/FollowUpsPage'), 'FollowUpsPage')
const MessagesPage = lazyModuleExport(() => import('@/pages/private/MessagesPage'), 'MessagesPage')
const PaymentsPage = lazyModuleExport(() => import('@/pages/private/PaymentsPage'), 'PaymentsPage')
const ProfessionalsPage = lazyModuleExport(
  () => import('@/pages/private/ProfessionalsPage'),
  'ProfessionalsPage',
)
const ServicesAdminPage = lazyModuleExport(
  () => import('@/pages/private/ServicesAdminPage'),
  'ServicesAdminPage',
)
const SettingsPage = lazyModuleExport(() => import('@/pages/private/SettingsPage'), 'SettingsPage')
const UsersPage = lazyModuleExport(() => import('@/pages/private/UsersPage'), 'UsersPage')
const NotFoundPage = lazyModuleExport(() => import('@/pages/NotFoundPage'), 'NotFoundPage')

export const AppRoutes = () => (
  <Suspense fallback={<LoadingScreen message="Cargando vista..." />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/sobre-puentes" element={<AboutPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/equipo" element={<TeamPage />} />
        <Route path="/acompanamiento" element={<ApproachPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/novedades" element={<NewsPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/app" element={<PrivateLayout />}>
          <Route index element={<Navigate replace to="/app/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="familias" element={<FamiliesPage />} />
          <Route path="ninos" element={<ChildrenPage />} />
          <Route path="profesionales" element={<ProfessionalsPage />} />
          <Route path="servicios" element={<ServicesAdminPage />} />
          <Route element={<RoleGate allowedRoles={['COORDINATION', 'SECRETARY', 'PROFESSIONAL']} />}>
            <Route path="mensajes" element={<MessagesPage />} />
          </Route>
          <Route element={<RoleGate allowedRoles={['COORDINATION', 'SECRETARY']} />}>
            <Route path="cobros" element={<PaymentsPage />} />
          </Route>
          <Route element={<RoleGate allowedRoles={['COORDINATION', 'PROFESSIONAL']} />}>
            <Route path="seguimientos" element={<FollowUpsPage />} />
            <Route path="seguimientos/:id/informe" element={<FollowUpReportPage />} />
          </Route>
          <Route element={<RoleGate allowedRoles={['ADMIN']} />}>
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="configuracion" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)
