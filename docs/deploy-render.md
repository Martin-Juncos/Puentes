# Deploy en Render

Esta guia deja el monorepo listo para desplegar `Puentes` en Render con:

- `puentes-db` como Postgres
- `puentes-api` como Web Service
- `puentes-web` como Static Site

## 1. Criterio de deploy

El deploy se hace desde la raiz del repo. No se usa `rootDir` por workspace porque el monorepo comparte un unico lockfile en `package-lock.json`.

El archivo [`render.yaml`](../render.yaml) ya incluye:

- build y start por workspace
- `preDeployCommand` con `prisma migrate deploy`
- rewrite SPA para React Router
- variables enlazadas a la base Render
- variables manuales marcadas con `sync: false`

## 2. Variables manuales en Render

### Frontend (`puentes-web`)

- `VITE_API_BASE_URL=https://api.<dominio>/api`
- `VITE_PUBLIC_SITE_URL=https://<dominio>`
- `VITE_WHATSAPP_URL=...` si quieren override por entorno

### Backend (`puentes-api`)

- `FRONTEND_URL=https://<dominio>`
- `FRONTEND_URLS=https://www.<dominio>` solo si tambien van a usar `www`
- `CONTACT_RECEIVER=...`
- `RESEND_API_KEY=...` si el formulario debe enviar email real
- `RESEND_FROM=...` si usan Resend
- `CLOUDINARY_CLOUD_NAME=...` solo si usan Cloudinary
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

Render genera `JWT_SECRET` automaticamente y conecta `DATABASE_URL` desde `puentes-db`.

## 3. Dominio propio

El blueprint no fija dominios porque el dominio real depende del proyecto y del DNS de la cuenta.

Configurar en Dashboard:

- Static Site: `https://<dominio>`
- Web Service: `https://api.<dominio>`

Despues de verificar ambos custom domains:

1. desactivar el subdominio `onrender.com` del frontend
2. desactivar el subdominio `onrender.com` del backend

Si el workspace es Hobby, revisar antes el limite de custom domains de Render.

## 4. Migraciones y primer admin

### Migraciones

El backend ya expone estos scripts:

```bash
npm run prisma:migrate:deploy
```

En Render, el backend corre esto automaticamente antes de arrancar:

```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

### Bootstrap del primer admin

No usar el seed demo en produccion.

El repo ahora incluye:

```bash
npm run bootstrap:admin
```

Ese comando ejecuta [`backend/scripts/bootstrap-admin.js`](../backend/scripts/bootstrap-admin.js) y requiere estas variables temporales:

- `BOOTSTRAP_ADMIN_FULL_NAME`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`

Flujo recomendado:

1. cargar esas 3 variables solo en `puentes-api`
2. abrir Shell o One-off Job sobre `puentes-api`
3. correr `npm run bootstrap:admin`
4. verificar login
5. borrar esas 3 variables del servicio

El script falla si:

- falta alguna variable
- el email ya existe
- ya existe otro usuario `ADMIN`

## 5. Checklist de salida

- `puentes-api` responde `200` en `/api/health`
- `puentes-web` resuelve rutas internas sin 404
- login funciona con cookie `httpOnly`
- el refresh de rutas privadas conserva sesion
- contacto guarda en DB aunque Resend no este configurado
- `FRONTEND_URL` y `VITE_API_BASE_URL` ya apuntan al dominio final

## 6. Referencias

- Render Monorepo Support: https://render.com/docs/monorepo-support
- Render Blueprint spec: https://render.com/docs/blueprint-spec
- Render Custom Domains: https://render.com/docs/custom-domains
- Render Redirects/Rewrites: https://render.com/docs/redirects-rewrites
