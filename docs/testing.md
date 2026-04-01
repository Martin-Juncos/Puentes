# Estrategia de testing

## Baseline actual

El repositorio ya tiene una base minima automatizada:

- frontend: `Vitest` + `Testing Library`;
- backend: `Vitest` + `Supertest`;
- CI: GitHub Actions ejecutando `lint`, `test` y `build`.

## Cobertura actual

Hoy hay cobertura inicial sobre:

- hooks compartidos del frontend con logica asincrona y sincronizacion de notificaciones;
- smoke tests del backend para healthcheck y contrato de 404.

## Objetivo de corto plazo

Mantener una estrategia proporcional al MVP:

1. Unit tests para hooks, utilidades y servicios con logica no trivial.
2. Integration tests de backend para auth, agenda, mensajes y contactos.
3. Smoke e2e para los flujos criticos cuando la superficie se estabilice:
   - login;
   - agenda;
   - contacto institucional.

## Comandos

```bash
npm run lint
npm run test
npm run build
```

## Nota de entorno local

En esta maquina, `npm run build` puede fallar en el paso `prisma generate` por el problema conocido de Windows + OneDrive con el engine de Prisma. La CI en GitHub no deberia heredar ese comportamiento porque corre sobre Linux.
