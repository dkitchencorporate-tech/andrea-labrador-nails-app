# Reglas Operativas y Gobernanza — Andrea Labrador Nails App

## 1. Prohibición Absoluta de Compilación Local
- Entorno de ejecución con recursos limitados: Intel Celeron N4120, 3.83 GB RAM total.
- **TERMINANTEMENTE PROHIBIDO** ejecutar compilaciones locales masivas (`npm run build`, `tsc`, `vite build`, `vercel build`).
- Toda compilación de producción debe realizarse exclusivamente en los servidores de Vercel en la nube.

## 2. Aislamiento Estricto de Repositorios
- Este proyecto es exclusivamente para **Andrea Labrador — Manicurista Profesional**.
- Queda terminantemente prohibido listar, consultar, mencionar o interactuar con repositorios, proyectos o despliegues de otros clientes o del equipo (`vercel list --all`, etc.).

## 3. Protocolo Obligatorio de Actualización y Despliegue (Git-First)
Tras cada requerimiento o cambio solicitado:
1. Realizar los cambios de código y verificar sintaxis localmente sin compilar.
2. `git add .`
3. `git commit -m "..."`
4. `git push origin master`
5. Si se requiere ejecutar la CLI de Vercel para producción:
   - Ejecutar de forma atómica y sin flags de compilación local: `npx vercel --prod --yes`
   - NUNCA lanzar comandos de compilación previa (`vercel build`) ni procesos simultáneos que choquen con la cola de Vercel.
