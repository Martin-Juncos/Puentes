import { Navigate, Route, Routes } from 'react-router-dom'

import { PublicLayout } from '@/layouts/PublicLayout'
import { PrivateLayout } from '@/layouts/PrivateLayout'
import { AboutPage } from '@/pages/public/AboutPage'
import { ApproachPage } from '@/pages/public/ApproachPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { HomePage } from '@/pages/public/HomePage'
import { NewsPage } from '@/pages/public/NewsPage'
import { ServicesPage } from '@/pages/public/ServicesPage'
import { TeamPage } from '@/pages/public/TeamPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { AgendaPage } from '@/pages/private/AgendaPage'
import { ChildrenPage } from '@/pages/private/ChildrenPage'
import { DashboardPage } from '@/pages/private/DashboardPage'
import { FamiliesPage } from '@/pages/private/FamiliesPage'
import { FollowUpReportPage } from '@/pages/private/FollowUpReportPage'
import { FollowUpsPage } from '@/pages/private/FollowUpsPage'
import { MessagesPage } from '@/pages/private/MessagesPage'
import { PaymentsPage } from '@/pages/private/PaymentsPage'
import { ProfessionalsPage } from '@/pages/private/ProfessionalsPage'
import { ServicesAdminPage } from '@/pages/private/ServicesAdminPage'
import { SettingsPage } from '@/pages/private/SettingsPage'
import { UsersPage } from '@/pages/private/UsersPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAuth } from '@/routes/RequireAuth'
import { RoleGate } from '@/routes/RoleGate'

export const AppRoutes = () => (
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
)
