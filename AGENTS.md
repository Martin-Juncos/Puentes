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
    src/
      app/
      routes/
      layouts/
      pages/
      features/
      components/
      hooks/
      services/
      utils/
      constants/
      assets/
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
- Secretaria y profesionales gestionan agenda, seguimiento y operación diaria.

## Criterios de arquitectura

- Priorizar claridad, mantenibilidad y crecimiento por etapas.
- Mantener permisos por rol desde el inicio: `admin`, `coordination`, `secretary`, `professional`.
- Tratar al sitio institucional y al panel interno como dos experiencias hermanas, no como una sola UI homogénea.
- Usar `motion` solo en el sitio institucional y transiciones útiles.
- Usar `react-big-calendar` solo donde aporte valor operativo real.

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

## Guía para futuros agentes y skills

- No reestructurar carpetas sin una razón fuerte.
- Extender módulos existentes antes de crear patrones paralelos.
- Si un cambio toca roles, permisos o agenda, validar primero el impacto en la operación interna.
- Si un cambio toca marketing o identidad, validar que no invada la lógica del panel.
- Documentar en `docs/` cualquier decisión estructural que afecte crecimiento futuro.
