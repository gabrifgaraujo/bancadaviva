# O que foi corrigido

## Back-End (estava seguindo `arquitetura-sistema-bancada.md`, não o teu stack real)

| Antes | Agora |
|---|---|
| TypeScript (`app.ts`, `tsx`) | JavaScript puro, `app.js` |
| MongoDB + Mongoose | PostgreSQL + Sequelize + migrations com `up`/`down` |
| `argon2` | `bcrypt` |
| Zod | `express-validator` + `validate()` |
| Sem rate limit segmentado | `authLimiter` (10/15min) + `generalLimiter` (100/min) |
| Sem Docker | `Dockerfile` + `docker-compose.yml` de 3 containers |
| IDs Mongo (`_id`) expostos | `id` interno (FK) + `uuid` exposto na API |
| Sem soft delete | `deletado_em` / `deletado_por` em `servicos` |
| `req.usuario` inconsistente | padronizado `req.user.id_usuario` em todo lugar |
| Sem Winston/Morgan | `requestLogger.js` + `config/logger.js` |
| Upload direto perdido | multer em memória → Cloudinary signed upload |

## Front-End (não era teu — gerado por outra ferramenta, "Grok Build App Builder")

O app antigo usava TanStack Start/Router, Postgres rodando **no navegador** via PGlite/WASM, auth própria (`better-auth`) e nem chamava o backend Express. Reconstruído do zero com:

- React 19 + TypeScript + Vite (SPA simples, não framework full-stack)
- React Router v6 com `ProtectedRoute` / `PublicRoute`
- Context API (`AuthContext`: `user`, `token`, `isAuthenticated`, `login`, `logout`, `updateUser`)
- `services/api.ts` — wrapper único do axios com Bearer token automático
- TailwindCSS com tokens de cor (`bg-primary`, `text-gray-dark`, `bg-status-*`), nada de hex hardcoded
- `public/_redirects` pro Netlify

Reaproveitei só os SVGs de `public/covers/` (fan, microwave, laptop, printer) — são ícones genéricos, sem lógica presa ao Grok.

## O que não veio nesta entrega

- **Gravação de áudio** (MediaRecorder) fica pra Fase 2, como já tava no roadmap — a coluna `tipo: "audio"` já existe no banco e no multer aceita o mime type, só falta o gravador na UI.
- **node-cron**: tirei do `package.json` por enquanto (nenhum job agendado ainda). Se entrar o alerta de "serviço parado há muito tempo" da Fase 3, volta.
- Não rodei `npm install` nem testei o build — sem acesso a rede neste ambiente. Confere os `package.json` antes de instalar.
