import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ChildrenPage } from './ChildrenPage'
import { useAuth } from '@/hooks/useAuth'
import { childrenService } from '@/services/childrenService'
import { familiesService } from '@/services/familiesService'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/services/childrenService', () => ({
  childrenService: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    assignProfessional: vi.fn(),
    clearAssignments: vi.fn(),
  },
}))

vi.mock('@/services/familiesService', () => ({
  familiesService: {
    list: vi.fn(),
  },
}))

vi.mock('@/services/professionalsService', () => ({
  professionalsService: {
    listManage: vi.fn(),
  },
}))

vi.mock('@/services/servicesService', () => ({
  servicesService: {
    listManage: vi.fn(),
  },
}))

const family = {
  id: 'family-1',
  displayName: 'Familia Perez',
}

const professional = {
  id: 'professional-1',
  user: {
    fullName: 'Lic. Ana Torres',
  },
}

const service = {
  id: 'service-1',
  name: 'Fonoaudiologia',
}

const child = {
  id: 'child-1',
  firstName: 'Mateo',
  lastName: 'Perez',
  birthDate: '2020-05-10T00:00:00.000Z',
  family,
  schoolName: 'Escuela 12',
  notes: 'Seguimiento inicial',
  disabilityCertificateIssuedAt: '2026-03-01T00:00:00.000Z',
  disabilityCertificateExpiresAt: '2027-03-01T00:00:00.000Z',
  disabilityCertificateIssuedBy: 'Junta Medica Provincial',
  status: 'ACTIVE',
  assignments: [],
}

const renderPage = async () => {
  render(
    <MemoryRouter>
      <ChildrenPage />
    </MemoryRouter>,
  )

  await waitFor(() => expect(familiesService.list).toHaveBeenCalled())
}

const getPanelCard = (title) => screen.getByText(title).closest('.surface-card')

describe('ChildrenPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      user: {
        role: 'ADMIN',
      },
    })

    childrenService.list.mockResolvedValue([child])
    childrenService.create.mockResolvedValue({})
    childrenService.update.mockImplementation(async (_id, payload) => ({
      ...child,
      ...payload,
      family,
    }))
    childrenService.remove.mockResolvedValue({})
    childrenService.assignProfessional.mockResolvedValue({})
    childrenService.clearAssignments.mockResolvedValue({})
    familiesService.list.mockResolvedValue([family])
    professionalsService.listManage.mockResolvedValue([professional])
    servicesService.listManage.mockResolvedValue([service])
  })

  afterEach(() => {
    cleanup()
  })

  it('renderiza los campos de certificado en el formulario de alta', async () => {
    await renderPage()

    const createForm = within(getPanelCard('Alta de niño o niña'))
      .getByRole('button', { name: /guardar ni/i })
      .closest('form')

    expect(within(createForm).getByText('Certificado de discapacidad')).toBeInTheDocument()
    expect(within(createForm).getByLabelText('Fecha de emisión')).toBeInTheDocument()
    expect(within(createForm).getByLabelText('Fecha de vencimiento')).toBeInTheDocument()
    expect(within(createForm).getByLabelText('Emitido por')).toBeInTheDocument()
  })

  it('envia los datos del certificado al crear un niño o niña', async () => {
    childrenService.list.mockResolvedValue([])

    await renderPage()

    const createForm = within(getPanelCard('Alta de niño o niña'))
      .getByRole('button', { name: /guardar ni/i })
      .closest('form')

    fireEvent.change(within(createForm).getByLabelText('Nombre'), {
      target: { value: 'Lola' },
    })
    fireEvent.change(within(createForm).getByLabelText('Apellido'), {
      target: { value: 'Suarez' },
    })
    fireEvent.change(within(createForm).getByLabelText('Fecha de nacimiento'), {
      target: { value: '2019-08-14' },
    })
    fireEvent.change(within(createForm).getByLabelText('Familia asociada'), {
      target: { value: family.id },
    })
    fireEvent.change(within(createForm).getByLabelText('Fecha de emisión'), {
      target: { value: '2026-04-01' },
    })
    fireEvent.change(within(createForm).getByLabelText('Fecha de vencimiento'), {
      target: { value: '2027-04-01' },
    })
    fireEvent.change(within(createForm).getByLabelText('Emitido por'), {
      target: { value: 'Junta Medica Provincial' },
    })

    fireEvent.submit(createForm)

    await waitFor(() =>
      expect(childrenService.create).toHaveBeenCalledWith({
        firstName: 'Lola',
        lastName: 'Suarez',
        birthDate: '2019-08-14',
        familyId: family.id,
        schoolName: '',
        notes: '',
        disabilityCertificateIssuedAt: '2026-04-01',
        disabilityCertificateExpiresAt: '2027-04-01',
        disabilityCertificateIssuedBy: 'Junta Medica Provincial',
      }),
    )
  })

  it('hidrata y reenvia los datos del certificado al editar un caso', async () => {
    await renderPage()

    const updateCard = getPanelCard('Actualizar o eliminar')

    fireEvent.change(within(updateCard).getByRole('combobox'), {
      target: { value: child.id },
    })

    await waitFor(() =>
      expect(screen.getAllByText('Certificado de discapacidad')).toHaveLength(2),
    )

    const updateForm = within(updateCard).getByRole('button', { name: /guardar cambios/i }).closest('form')

    expect(within(updateForm).getByLabelText('Fecha de emisión')).toHaveValue('2026-03-01')
    expect(within(updateForm).getByLabelText('Fecha de vencimiento')).toHaveValue('2027-03-01')
    expect(within(updateForm).getByLabelText('Emitido por')).toHaveValue('Junta Medica Provincial')

    fireEvent.change(within(updateForm).getByLabelText('Emitido por'), {
      target: { value: 'Ministerio de Salud' },
    })
    fireEvent.submit(updateForm)

    await waitFor(() =>
      expect(childrenService.update).toHaveBeenCalledWith(child.id, {
        firstName: 'Mateo',
        lastName: 'Perez',
        birthDate: '2020-05-10',
        familyId: family.id,
        schoolName: 'Escuela 12',
        notes: 'Seguimiento inicial',
        disabilityCertificateIssuedAt: '2026-03-01',
        disabilityCertificateExpiresAt: '2027-03-01',
        disabilityCertificateIssuedBy: 'Ministerio de Salud',
        status: 'ACTIVE',
      }),
    )
  })
})
