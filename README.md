[![Build](https://img.shields.io/badge/build-sin%20CI-lightgrey)](#11-cómo-correr-los-tests)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-TODO-lightgrey)](#14-licencia)

# Puentes

## 1. Nombre y descripción

Puentes es una aplicación fullstack para un centro interdisciplinario de acompañamiento del desarrollo infantil y trabajo con familias. El repositorio implementa dos experiencias coordinadas sobre una misma base técnica:

- un sitio público institucional para comunicar identidad, enfoque, servicios, equipo y canales de contacto;
- un panel interno con acceso por roles para sostener la operación diaria del centro.

En su estado actual, el proyecto combina gestión operativa, agenda, seguimiento, mensajería interna, notificaciones, cobros, usuarios y configuración institucional, evitando reducir el producto a una landing estática o a un turnero público.

## 2. Problema que resuelve

Puentes responde a un problema doble que aparece con frecuencia en centros terapéuticos o interdisciplinarios:

1. La comunicación institucional suele quedar separada de la operación interna.
2. La operación diaria requiere permisos, trazabilidad y organización por roles, no solo formularios o agendas aisladas.

El código refleja esa necesidad con una arquitectura que separa explícitamente la capa pública de la capa privada, mientras comparte una API REST, una base de datos PostgreSQL y un modelo de permisos para `ADMIN`, `COORDINATION`, `SECRETARY` y `PROFESSIONAL`.

## 3. Demo / Screenshots

<!-- TODO: agregar capturas o GIFs reales del sitio público, login, dashboard, agenda y mensajería interna. -->
<!-- Sugerencia: guardar los assets en docs/screenshots/ y referenciarlos con rutas relativas. -->

Ejemplo de placeholders cuando haya material visual:

```md
![Home pública](docs/screenshots/home-publica.png)
![Panel interno](docs/screenshots/panel-dashboard.png)
```

## 4. Funcionalidades principales

- Sitio público con páginas de inicio, sobre Puentes, servicios, equipo, acompañamiento, contacto y novedades.
- Formulario de contacto institucional que guarda consultas en base de datos y, si `RESEND_API_KEY` está configurada, envía email institucional.
- Autenticación con backend propio y recuperación de sesión desde frontend.
- Autorización por roles tanto en frontend (`RequireAuth`, `RoleGate`) como en backend (`authenticate`, `authorize`).
- Dashboard operativo con métricas resumidas y próximas sesiones.
- Agenda interna con calendario operativo (`react-big-calendar`), alta, edición, cancelación y eliminación controlada de sesiones.
- Gestión de familias, niños, profesionales, servicios, usuarios y configuración institucional.
- Registro de asistencia y cobros.
- Seguimientos con editor enriquecido, listado, edición, borrado e informe imprimible.
- Mensajería interna con hilos por caso o contexto general, prioridades, participantes y estados de lectura.
- Panel de notificaciones con polling periódico, contador de no leídas y acciones de marcado.
- Seed de datos demo con usuarios por rol, servicios iniciales, agenda, cobros, seguimiento y consulta institucional.

## 5. Stack tecnológico

| Capa | Tecnologías confirmadas en el repo |
| --- | --- |
| Monorepo | `npm workspaces`, `concurrently` |
| Frontend | `React 19`, `Vite 8`, `JavaScript`, `React Router 7`, `Tailwind CSS` vía `@tailwindcss/vite` |
| UI y experiencia | `motion`, `react-big-calendar`, `react-icons`, `react-bootstrap`, `bootstrap`, `animejs`, `date-fns` |
| Backend | `Node.js`, `Express 5`, `cookie-parser`, `cors`, `morgan`, `dotenv` |
| Auth y seguridad | `jsonwebtoken`, cookies `httpOnly`, `bcryptjs`, middlewares de autenticación/autorización |
| Validación y errores | `Zod`, `AppError`, `errorHandler`, contrato uniforme de errores |
| Persistencia | `PostgreSQL`, `Prisma ORM` |
| Integraciones | `Resend` para email institucional opcional |
| Calidad | `ESLint` en frontend y backend |

## 6. Arquitectura

El sistema está organizado como un monorepo fullstack con dos workspaces principales:

- `frontend/` concentra la experiencia pública y el panel interno.
- `backend/` expone una API REST modular y encapsula autenticación, validación, reglas de negocio y acceso a datos.

Patrones observados en el código:

- Frontend por capas: `layouts` -> `pages` -> `features/components` -> `services` -> `apiClient`.
- Backend por dominio: `routes` -> `controller` -> `service` -> `repository` -> `Prisma`.
- Validación de requests con `Zod` mediante middleware.
- Autenticación por JWT almacenado en cookie `httpOnly`.
- Respuesta exitosa uniforme con `{ data, meta? }`.
- Respuesta de error uniforme con `{ error: { code, message, details? } }`.

```mermaid
flowchart LR
  subgraph FE[frontend/]
    Public[PublicLayout + páginas públicas]
    Private[PrivateLayout + panel por rol]
    Services[services/*.js + apiClient]
  end

  subgraph BE[backend/]
    Router[/routes/index.js/]
    Middleware[authenticate + authorize + validate + errorHandler]
    Modules[modules/<dominio>]
    PrismaClient[Prisma Client]
  end

  DB[(PostgreSQL)]
  Resend[Resend opcional]

  Public --> Services
  Private --> Services
  Services -->|HTTP + cookies| Router
  Router --> Middleware --> Modules --> PrismaClient --> DB
  Modules --> Resend
```

### Módulos backend detectados

- `auth`
- `contacts`
- `users`
- `professionals`
- `services`
- `families`
- `children`
- `sessions`
- `attendances`
- `payments`
- `follow-ups`
- `messages`
- `notifications`
- `dashboard`
- `settings`

## 7. Estructura de carpetas

```text
.
├── frontend/                      # Aplicación React/Vite del sitio público y del panel interno
│   ├── public/media/              # Assets runtime del sitio institucional
│   ├── src/app/                   # Ensamble principal de la app
│   ├── src/components/ui/         # Primitives y componentes reutilizables base
│   ├── src/components/private/    # Bloques compartidos del panel interno
│   ├── src/constants/             # Navegación, contenido y catálogos del frontend
│   ├── src/features/              # Features funcionales como auth, home, calendar, contact, dashboard
│   ├── src/hooks/                 # Hooks reutilizables (`useAuth`, `useAsyncData`, `usePolling`, etc.)
│   ├── src/layouts/               # Layout público y layout privado
│   ├── src/pages/                 # Páginas de rutas públicas, privadas y auth
│   ├── src/routes/                # Router, guards y gates por rol
│   ├── src/services/              # Capa de acceso a API desacoplada de la UI
│   ├── src/styles/                # Tokens, base CSS y estilos vendor
│   └── src/utils/                 # Helpers de formato, rich text, eventos y utilidades varias
├── backend/                       # API Express y acceso a datos
│   ├── prisma/                    # `schema.prisma`, migraciones y seed demo
│   └── src/
│       ├── config/                # Variables de entorno, settings y catálogos por defecto
│       ├── db/                    # Inicialización compartida de Prisma
│       ├── middleware/            # Auth, validación, async handler, 404 y manejo de errores
│       ├── modules/               # Dominios REST con route/controller/service/repository/validation
│       ├── routes/                # Router raíz de `/api`
│       └── utils/                 # Helpers, permisos, respuestas, adapters y selects
├── docs/                          # Documentación técnica complementaria
├── .env.example                   # Plantilla base de variables de entorno
├── package.json                   # Scripts raíz y definición de workspaces
└── AGENTS.md                      # Reglas operativas y de arquitectura del repositorio
```

## 8. Requisitos previos

- `Node.js >= 22.0.0`
- `npm` compatible con workspaces
- `PostgreSQL` disponible localmente o accesible vía `DATABASE_URL`
- Un archivo `.env` en la raíz del repo, basado en `.env.example`
- Opcional: una cuenta/configuración de Resend si se quiere enviar email institucional real

Nota de entorno detectada en el repo:

- En Windows con carpetas sincronizadas por OneDrive, `prisma generate` puede fallar por bloqueo del engine nativo durante renames. El riesgo está documentado en `docs/architecture.md`.

## 9. Instalación y configuración

### 9.1. Instalar dependencias

```bash
npm install
```

### 9.2. Crear variables de entorno

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

Comportamiento de carga de variables confirmado en el código:

- El frontend usa `envDir: '..'`, por lo que toma variables desde la raíz del monorepo.
- El backend carga primero `/.env` y luego `backend/.env`, usando este último como override local si existe.

### 9.3. Configurar la base de datos

1. Crear una base PostgreSQL vacía o ajustar `DATABASE_URL` a una ya existente.
2. Ejecutar migraciones:

```bash
npm run prisma:migrate
```

### 9.4. Cargar datos demo

```bash
npm run prisma:seed
```

Importante:

- El seed actual hace `deleteMany()` sobre las tablas principales antes de recrear datos demo.
- Usarlo solo en un entorno local o descartable.

### 9.5. Levantar el proyecto

Frontend y backend juntos:

```bash
npm run dev
```

Solo frontend:

```bash
npm run dev:frontend
```

Solo backend:

```bash
npm run dev:backend
```

### 9.6. Build local

```bash
npm run build
```

### 9.7. Credenciales demo incluidas en el seed

| Rol | Email | Password |
| --- | --- | --- |
| `ADMIN` | `admin@puentes.local` | `Puentes2026!` |
| `COORDINATION` | `coordinacion@puentes.local` | `Puentes2026!` |
| `SECRETARY` | `secretaria@puentes.local` | `Puentes2026!` |
| `PROFESSIONAL` | `profesional@puentes.local` | `Puentes2026!` |

## 10. Variables de entorno

### Compartidas

| Variable | Capa | Descripción inferida | Ejemplo |
| --- | --- | --- | --- |
| `NODE_ENV` | Backend / runtime | Modo de ejecución; afecta `env.isProduction` y el singleton de Prisma | `development` |
| `FRONTEND_URL` | Backend | Origen principal permitido por CORS | `http://localhost:5173` |
| `FRONTEND_URLS` | Backend | Lista CSV opcional de orígenes adicionales permitidos por CORS | `http://127.0.0.1:5173,http://192.168.0.24:5173` |
| `PORT` | Backend | Puerto HTTP del servidor Express | `4000` |

### Frontend

| Variable | Uso inferido en código | Ejemplo |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL del `apiClient` (`frontend/src/services/http/client.js`) | `http://localhost:4000/api` |
| `VITE_PUBLIC_SITE_URL` | No se detectó consumo directo en el código relevado | `http://localhost:5173` |
| `VITE_WHATSAPP_URL` | No se detectó consumo directo en el código relevado | `https://wa.me/5491100000000?text=Hola%20Puentes` |

### Backend

| Variable | Uso inferido en código | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | Conexión de Prisma a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/puentes` |
| `JWT_SECRET` | Firma y verificación de JWT | `change-me-with-a-long-random-secret` |
| `JWT_EXPIRES_IN` | Expiración del token JWT | `7d` |
| `COOKIE_NAME` | Nombre de la cookie de sesión | `puentes_token` |
| `COOKIE_SECURE` | Define si la cookie requiere canal seguro | `false` |
| `RESEND_API_KEY` | Habilita envío de email institucional real desde el módulo de contacto | `` |
| `RESEND_FROM` | Remitente del email enviado por Resend | `"Puentes <onboarding@resend.dev>"` |
| `CONTACT_RECEIVER` | Destinatario institucional de las consultas de contacto | `contacto@puentes.local` |
| `CLOUDINARY_CLOUD_NAME` | Configuración preparada en `getCloudinaryConfig()` | `` |
| `CLOUDINARY_API_KEY` | Configuración preparada en `getCloudinaryConfig()` | `` |
| `CLOUDINARY_API_SECRET` | Configuración preparada en `getCloudinaryConfig()` | `` |

## 11. Cómo correr los tests

Actualmente el repositorio no define scripts `test` en `package.json` ni se detectaron archivos `*.test.*` o `*.spec.*` dentro de `frontend/` y `backend/`.

La validación automatizada disponible hoy es:

```bash
npm run lint
npm run build
```

Qué cubre hoy esa validación:

- `npm run lint`: reglas ESLint del frontend y del backend.
- `npm run build`: build de Vite en frontend y `prisma generate` en backend.

Cobertura esperada:

<!-- TODO: definir estrategia de testing automatizado y cobertura objetivo (unitaria, integración, e2e). -->

## 12. Guía de contribución

Estado inferido del repositorio:

- La rama detectada local y remota es `master`.
- No se detectaron plantillas de PR ni flujos de CI configurados en `.github/`.
- El historial reciente no muestra una convención formal de commits tipo Conventional Commits.

Flujo mínimo sugerido y compatible con el estado actual del repo:

1. Crear una rama desde `master`.
2. Mantener el cambio acotado al workspace o módulo afectado.
3. Ejecutar `npm run lint` y `npm run build` antes de abrir el PR.
4. Abrir el PR contra `master`.

Convenciones pendientes de formalizar:

- Branching:
  `<!-- TODO: definir naming de ramas -->`
- Commits:
  `<!-- TODO: definir convención de mensajes de commit -->`
- Pull requests:
  `<!-- TODO: definir checklist o template de PR -->`

## 13. Roadmap

Items detectados en `docs/architecture.md` como etapas previstas:

- Recursos o novedades administrables.
- Área privada para familias.
- Comunicaciones ampliadas.
- Recordatorios y mayor trazabilidad.
- Reportes más completos.
- Automatizaciones justificadas.
- Integraciones operativas adicionales.

## 14. Licencia

No se detectó un archivo `LICENSE` en la raíz del repositorio.

`<!-- TODO: completar tipo de licencia del proyecto -->`

## 15. Autores / Contacto

- Mantenimiento técnico del repositorio:
  `<!-- TODO: completar responsables técnicos / mantenedores -->`
- Contacto institucional por defecto en la configuración inicial:
  `contacto@puentes.local`

Hecho por el Prof. Mercho con mucho 💖 y ☕
