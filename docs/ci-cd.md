# CI/CD minimo

## Objetivo

El repositorio usa una baseline de CI en GitHub Actions para validar el estado tecnico minimo del monorepo en cada PR y en pushes a ramas principales.

Workflow activo:

- `.github/workflows/ci.yml`

## Que ejecuta

La workflow corre, en este orden:

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

Esto cubre:

- lint de frontend y backend;
- tests de Vitest en frontend y backend;
- build de Vite en frontend;
- `prisma generate` en backend.

## Variables de entorno de apoyo en CI

La workflow define variables minimas para que backend y Prisma puedan inicializar sin depender de secretos reales:

- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/puentes_ci`
- `JWT_SECRET=ci-build-secret-change-me-please`
- `FRONTEND_URL=http://localhost:5173`
- `CONTACT_RECEIVER=contacto@puentes.local`
- `RESEND_FROM=Puentes <onboarding@resend.dev>`

Estas variables existen solo para validacion tecnica en CI. No reemplazan la configuracion real de staging o produccion.

## Nota sobre el entorno local

En GitHub Actions, la build corre sobre Linux y no deberia verse afectada por el problema de rename del engine nativo de Prisma que puede aparecer en Windows cuando el repo vive dentro de una carpeta sincronizada por OneDrive.

Si `npm run build` falla localmente con un `EPERM` en `query_engine-*.dll.node`, tomarlo como una limitacion del entorno local y no como una rotura automatica del proyecto.
