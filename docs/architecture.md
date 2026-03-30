# Arquitectura base de Puentes

## Decisión general

Puentes se implementa como una aplicación fullstack con dos superficies coordinadas:

- `frontend/`: experiencia pública institucional y panel interno operativo.
- `backend/`: API REST modular, autenticación, permisos, reglas básicas de negocio e integración con PostgreSQL.

## Principios rectores

1. La plataforma no es un turnero público.
2. La familia no autogestiona agenda en el MVP.
3. Secretaría, coordinación y profesionales sostienen la operación.
4. La capa pública y la privada comparten identidad institucional, pero no la misma densidad ni el mismo ritmo visual.

## Backend

- Express con módulos por dominio.
- Prisma ORM sobre PostgreSQL.
- JWT en cookie `httpOnly`.
- Validación con Zod.
- Middleware global para errores y respuestas uniformes.

Dominios activos:

- auth
- contacts
- users
- professionals
- services
- families
- children
- sessions
- attendances
- payments
- follow-ups
- messages
- notifications
- dashboard
- settings

## Frontend

- React Router con layouts separados:
  - `PublicLayout`
  - `PrivateLayout`
- Contexto de autenticación basado en sesión backend.
- Capa de servicios HTTP con `fetch`.
- Componentes UI reutilizables y módulos funcionales por dominio.
- Módulos activos del panel:
  - agenda
  - familias
  - niños
  - profesionales
  - servicios
  - cobros
  - seguimientos
  - mensajería
  - usuarios
  - configuración

## Etapas previstas

### Etapa 1

- Presencia institucional fuerte
- Operación interna base
- Auth y permisos
- Agenda, niños, familias, profesionales, servicios, cobros, asistencia y seguimientos básicos
- Mensajería interna y notificaciones operativas

### Etapa 2

- Recursos o novedades administrables
- Área privada para familias
- Comunicaciones ampliadas
- Recordatorios y trazabilidad

### Etapa 3

- Reportes más completos
- Automatizaciones justificadas
- Integraciones operativas adicionales

## Nota de entorno

- El repo mantiene `lint` y build del frontend como validaciones estables.
- En entornos Windows sincronizados con OneDrive, `prisma generate` puede fallar por bloqueo de archivos nativos durante el rename del motor. Es un riesgo de entorno conocido, no una decisión de arquitectura del proyecto.
