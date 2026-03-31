import { FiEdit3, FiPlusCircle, FiTrash2 } from 'react-icons/fi'

import { PanelSectionHeader } from '@/components/private/PanelSectionHeader'
import { SelectionStateCard } from '@/components/private/SelectionStateCard'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { FormErrorAlert } from '@/components/ui/FormErrorAlert'
import { PanelCard } from '@/components/ui/PanelCard'

import {
  buildSessionOptionLabel,
  getSessionScheduleLabel,
  getSessionTitle,
  sessionStatusLabels,
} from './sessionAgendaUtils'

export const AgendaManagementPanel = ({
  children,
  professionals,
  services,
  sessions,
  createForm,
  updateForm,
  createError,
  updateError,
  isSubmittingCreate,
  isSubmittingUpdate,
  selectedSession,
  onCreateFieldChange,
  onUpdateFieldChange,
  onCreate,
  onUpdate,
  onSelectionChange,
  onClearSelection,
  onOpenDeleteModal,
  disableProfessionalSelection = false,
  professionalFieldHint,
  createDescription,
  updateDescription,
  createPanelRef,
  createStartInputRef,
  createPrefillMessage,
}) => (
  <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
    <div ref={createPanelRef}>
      <PanelCard>
        <PanelSectionHeader
          description={
            createDescription ??
            'Definí niño o niña, profesional, servicio, horario de inicio, duración y notas internas para crear una nueva sesión.'
          }
          icon={FiPlusCircle}
          title="Crear sesión"
        />

        {createPrefillMessage ? (
          <div className="mt-4 rounded-2xl border border-[rgba(47,93,115,0.12)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[var(--color-primary)]">
            {createPrefillMessage}
          </div>
        ) : null}

        <form className="mt-6 grid gap-4" onSubmit={onCreate}>
          <Field label="Niño o niña" required>
            <select className="field-input" onChange={onCreateFieldChange('childId')} required value={createForm.childId}>
              <option value="">Seleccionar</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </Field>

          <Field hint={professionalFieldHint} label="Profesional" required>
            <select
              className="field-input"
              disabled={disableProfessionalSelection}
              onChange={onCreateFieldChange('professionalId')}
              required
              value={createForm.professionalId}
            >
              <option value="">Seleccionar</option>
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.user.fullName} · {professional.discipline}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Servicio" required>
            <select className="field-input" onChange={onCreateFieldChange('serviceId')} required value={createForm.serviceId}>
              <option value="">Seleccionar</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Inicio" required>
            <input
              className="field-input"
              onChange={onCreateFieldChange('startsAt')}
              ref={createStartInputRef}
              required
              type="datetime-local"
              value={createForm.startsAt}
            />
          </Field>

          <Field
            hint="Se completa con la duración del servicio, pero podés ajustarla manualmente."
            label="Duración (minutos)"
            required
          >
          <input
            className="field-input"
            min="1"
            onChange={onCreateFieldChange('durationMinutes')}
            required
            step="1"
            type="number"
            value={createForm.durationMinutes}
          />
          </Field>

          <Field label="Observaciones administrativas">
            <textarea
              className="field-input min-h-24"
              onChange={onCreateFieldChange('adminNotes')}
              value={createForm.adminNotes}
            />
          </Field>

          <Field label="Notas internas">
            <textarea
              className="field-input min-h-24"
              onChange={onCreateFieldChange('internalNotes')}
              value={createForm.internalNotes}
            />
          </Field>

          <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[var(--color-text-soft)]">
            Estado inicial: <span className="font-semibold text-[var(--color-primary)]">Programada</span>
          </div>

          {createError ? <FormErrorAlert>{createError}</FormErrorAlert> : null}

          <Button disabled={isSubmittingCreate} type="submit">
            {isSubmittingCreate ? 'Guardando sesión...' : 'Crear sesión'}
          </Button>
        </form>
      </PanelCard>
    </div>

    <PanelCard>
      <PanelSectionHeader
        actions={
          selectedSession ? (
            <Button onClick={onClearSelection} type="button" variant="ghost">
              Limpiar selección
            </Button>
          ) : null
        }
        description={
          updateDescription ??
          'Seleccioná una sesión existente para editarla, cancelarla o eliminarla si todavía no tiene historial.'
        }
        icon={FiEdit3}
        title="Editar o eliminar sesión"
      />

      <form className="mt-6 grid gap-4" onSubmit={onUpdate}>
        <Field
          hint="También podés seleccionar la sesión haciendo clic en el calendario o en el listado inferior."
          label="Sesión seleccionada"
        >
          <select className="field-input" onChange={onSelectionChange} value={updateForm.id}>
            <option value="">Seleccionar sesión</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {buildSessionOptionLabel(session)}
              </option>
            ))}
          </select>
        </Field>

        <SelectionStateCard
          emptyText="Elegí una sesión para habilitar la edición completa."
          lines={
            selectedSession
              ? [
                  `Horario: ${getSessionScheduleLabel(selectedSession)}`,
                  `Servicio: ${selectedSession.service.name}`,
                  `Profesional: ${selectedSession.professional.user.fullName}`,
                  `Estado: ${sessionStatusLabels[selectedSession.status] ?? selectedSession.status}`,
                ]
              : []
          }
          title={selectedSession ? getSessionTitle(selectedSession) : ''}
        />

        {selectedSession ? (
          <>
            <Field label="Niño o niña" required>
              <select className="field-input" onChange={onUpdateFieldChange('childId')} required value={updateForm.childId}>
                <option value="">Seleccionar</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </Field>

            <Field hint={professionalFieldHint} label="Profesional" required>
              <select
                className="field-input"
                disabled={disableProfessionalSelection}
                onChange={onUpdateFieldChange('professionalId')}
                required
                value={updateForm.professionalId}
              >
                <option value="">Seleccionar</option>
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.user.fullName} · {professional.discipline}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Servicio" required>
              <select className="field-input" onChange={onUpdateFieldChange('serviceId')} required value={updateForm.serviceId}>
                <option value="">Seleccionar</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Inicio" required>
              <input
                className="field-input"
                onChange={onUpdateFieldChange('startsAt')}
                required
                type="datetime-local"
                value={updateForm.startsAt}
              />
            </Field>

            <Field
              hint="Se calcula desde el inicio y podés ajustarla si esta sesión necesita otro tiempo."
              label="Duración (minutos)"
              required
            >
              <input
                className="field-input"
                min="1"
                onChange={onUpdateFieldChange('durationMinutes')}
                required
                step="1"
                type="number"
                value={updateForm.durationMinutes}
              />
            </Field>

            <Field label="Estado">
              <select className="field-input" onChange={onUpdateFieldChange('status')} value={updateForm.status}>
                {Object.entries(sessionStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Observaciones administrativas">
              <textarea
                className="field-input min-h-24"
                onChange={onUpdateFieldChange('adminNotes')}
                value={updateForm.adminNotes}
              />
            </Field>

            <Field label="Notas internas">
              <textarea
                className="field-input min-h-24"
                onChange={onUpdateFieldChange('internalNotes')}
                value={updateForm.internalNotes}
              />
            </Field>
          </>
        ) : null}

        {updateError ? <FormErrorAlert>{updateError}</FormErrorAlert> : null}

        {selectedSession ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button disabled={isSubmittingUpdate} type="submit" variant="secondary">
              {isSubmittingUpdate ? 'Guardando cambios...' : 'Guardar cambios'}
            </Button>

            <Button
              className="px-4 py-3 text-[#8b4b3d] hover:bg-[rgba(217,140,122,0.12)]"
              onClick={onOpenDeleteModal}
              type="button"
              variant="ghost"
            >
              <FiTrash2 aria-hidden="true" className="size-4" />
              Eliminar sesión
            </Button>
          </div>
        ) : null}
      </form>
    </PanelCard>
  </div>
)
