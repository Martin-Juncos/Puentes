# AGENTS.md

## Propósito del proyecto

Puentes es una plataforma fullstack híbrida para un centro interdisciplinario de acompañamiento del desarrollo infantil y trabajo con familias. El producto combina:

- una capa pública institucional para comunicar identidad, servicios, equipo y contacto;
- una capa privada operativa para agenda, seguimiento básico, administración y permisos por rol.

El MVP no debe degradarse a una landing vacía ni a un turnero público.

## Stack real elegido

- Monorepo npm workspaces con `frontend/` y `backend/`
- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router, `motion`, `react-big-calendar`
- Backend: Node.js, Express, JWT en cookie `httpOnly`, Zod para validación, manejo estandarizado de errores
- Base de datos: PostgreSQL con Prisma ORM
- Integraciones preparadas: SMTP para contacto, Cloudinary adapter, helper de WhatsApp

## Estructura de carpetas

```text
/
  frontend/
    public/
      media/
    src/
      app/
      routes/
      layouts/
      pages/
      features/
      components/
        ui/
        private/
      hooks/
      services/
      utils/
      constants/
      styles/
  backend/
    prisma/
    src/
      config/
      db/
      middleware/
      modules/
      utils/
  docs/
```

## Comandos de desarrollo

- `npm install`
- `npm run dev`
- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run lint`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Convenciones del repo

- Usar español en contenidos, labels y textos de UI salvo dependencia técnica.
- Mantener separación explícita entre layout público y layout privado.
- No mezclar lógica de negocio con presentación.
- En backend, cada dominio vive en `src/modules/<dominio>/` con `routes`, `controller`, `service`, `repository` y `validation`.
- En frontend, la UI consume servicios desacoplados de `src/services/`.
- La agenda se gestiona desde roles internos; la familia no autogestiona turnos en el MVP.
- Secretaría y profesionales gestionan agenda, seguimiento y operación diaria.
- Mensajería y notificaciones son módulos activos del panel y no deben tratarse como código muerto.

## Criterios de arquitectura

- Priorizar claridad, mantenibilidad y crecimiento por etapas.
- Mantener permisos por rol desde el inicio: `admin`, `coordination`, `secretary`, `professional`.
- Tratar al sitio institucional y al panel interno como dos experiencias hermanas, no como una sola UI homogénea.
- Usar `motion` solo en el sitio institucional y transiciones útiles.
- Usar `react-big-calendar` solo donde aporte valor operativo real.
- Extender componentes privados compartidos antes de duplicar patrones de formularios, encabezados o tablas.

## Sistema visual y consistencia

- La fuente de verdad visual del frontend vive en:
  - `frontend/src/styles/tokens.css`
  - `frontend/src/styles/base.css`
  - `frontend/src/styles/vendor.css`
- No definir colores, radios, sombras o focos nuevos directamente en páginas si ya existe un token o primitive.
- Para nuevas superficies, reutilizar primero estas primitives:
  - `Button`
  - `Alert`
  - `Badge`
  - `StatusBadge`
  - `Field`
  - `PanelCard`
  - `DataTable`
  - `ModalShell`
  - `EmptyState`
  - `InlineLoader`
  - `PageHeader`
- `components/ui/` es la capa base; `components/private/` agrupa bloques del panel. No crear variantes paralelas sin justificarlo.
- Público y privado comparten tokens, pero no densidad ni ritmo:
  - público: más aire, fotografía y jerarquía editorial;
  - privado: más contención, legibilidad y prioridad operativa.
- Mantener `react-icons/fi` como familia iconográfica principal.
- Evitar mezclar superficies muy dramáticas o decorativas dentro del panel.

## Política de imágenes y assets

- `frontend/public/media/` es la fuente runtime canónica de imágenes.
- `frontend/src/constants/media.js` define el catálogo reutilizable de assets públicos.
- No usar strings sueltos de `/media/...` en páginas nuevas: importar desde `media.js`.
- Reutilizar assets existentes antes de incorporar nuevos recursos.
- Reservar fotografía e imágenes institucionales para la capa pública y auth; el panel interno debe seguir siendo visualmente austero.

## Restricciones importantes del MVP

- No implementar reserva pública de turnos.
- No implementar autogestión de agenda por familias.
- No implementar pagos online.
- No implementar historia clínica avanzada ni chat en tiempo real.
- No sobredimensionar integraciones externas.

## Criterio visual

- Público: institucional, cálido, profesional, humano, moderno.
- Privado: sobrio, claro, operativo, altamente legible.
- Mantener la paleta institucional como base y evitar mezclar un lenguaje demasiado clínico, infantil o corporativo.

## Validación mínima antes de cerrar tareas

- Ejecutar `npm run lint`.
- Ejecutar `npm run build`.
- Verificar auth, guards y contrato de error `{ error: { code, message, details? } }`.
- Verificar responsive básico del sitio público y legibilidad del panel.
- Confirmar que cualquier cambio preserve la dualidad público/privado del producto.
- Revisar que nuevos botones, alerts, badges, tablas, loaders y modales reutilicen el sistema existente.

## Guía para futuros agentes y skills

- No reestructurar carpetas sin una razón fuerte.
- Extender módulos existentes antes de crear patrones paralelos.
- Si un cambio toca roles, permisos, agenda, mensajería o notificaciones, validar primero el impacto en la operación interna.
- Si un cambio toca marketing o identidad, validar que no invada la lógica del panel.
- Si un cambio toca UI, revisar primero `components/ui`, `components/private`, `styles/` y `constants/media.js`.
- Documentar en `docs/` cualquier decisión estructural que afecte crecimiento futuro.
- Tener presente que `prisma generate` puede fallar en Windows + OneDrive por bloqueo del engine durante renames; si pasa, documentarlo en vez de ocultarlo con workarounds frágiles.
