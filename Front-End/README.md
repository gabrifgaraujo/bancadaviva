# BancadaViva — Front-End

SPA em React + TypeScript + Vite.

## Rodando local (sem Docker)

```bash
npm install
cp .env.exemplo .env   # confere se VITE_API_URL aponta pro backend certo
npm run dev
```

Abre em http://localhost:5173 — precisa do backend rodando (ver `Back-End/README.md`).

## Rodando com Docker

Na raiz do projeto: `docker compose up`.

## Estrutura

```
src/
├── Pages/            # telas: Login, Board, NovoServico, DetalheServico
├── components/
│   ├── ui/            # Button, Input, ActionButton
│   ├── routes/         # ProtectedRoute, PublicRoute
│   └── navegation/      # Nav (header + toggle de tema)
├── contexts/          # AuthContext
├── hooks/             # useAuth, useToast
├── services/          # api.ts (axios) + um arquivo por recurso
├── layout/            # LayoutHome
├── types/             # tipos compartilhados
└── utils/             # apiError, format (tempo relativo)
```

## Build de produção

```bash
npm run build
```

Gera `dist/`. O `public/_redirects` já está configurado pra deploy no Netlify (SPA fallback pro `index.html`).
