# Guia de contribucion

## Flujo recomendado

1. Crear una rama desde `master`.
2. Mantener el cambio acotado a un modulo, workspace o problema puntual.
3. Ejecutar `npm run lint`, `npm run test` y `npm run build` antes de abrir el PR.
4. Abrir el PR usando `.github/pull_request_template.md`.

## Naming de ramas

Usar un prefijo corto segun el tipo de cambio:

- `feat/<tema-corto>`
- `fix/<tema-corto>`
- `chore/<tema-corto>`
- `docs/<tema-corto>`
- `refactor/<tema-corto>`

Ejemplos:

- `feat/dashboard-cobros`
- `fix/agenda-edicion-sesiones`
- `docs/ci-y-contribucion`

## Mensajes de commit

No hace falta imponer Conventional Commits completos, pero si una convencion liviana y consistente:

- escribir en imperativo;
- describir el cambio principal, no el proceso;
- mantener el asunto corto y claro.

Ejemplos:

- `Corrige carga inicial del panel de mensajes`
- `Agrega tests base para hooks del frontend`
- `Documenta workflow minima de CI`

## Criterios antes de mergear

- El cambio tiene alcance claro y acotado.
- La CI de GitHub queda en verde.
- Si toca auth, agenda, mensajeria o notificaciones, el PR explica el impacto operativo.
- Si toca estilos del sitio publico, se revisa que no invada el panel interno.

## GitHub

- `master` deberia mantenerse protegido con la workflow de CI como required check.
- `CODEOWNERS` usa como baseline a `@Martin-Juncos`, inferido desde el remote actual del repositorio.
