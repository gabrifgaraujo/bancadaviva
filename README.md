# BancadaViva

> "Onde eu parei?" respondido em um clique — sem precisar da bagunça física da bancada.

Sistema de organização visual de serviços pra técnicos de manutenção autônomos (eletrônica, eletrodomésticos, informática). Pensado pra baixa carga cognitiva: cada serviço guarda seu próprio estado visual — foto, status, checklist e a última nota de progresso — pra retomar qualquer trabalho em 1 toque, sem precisar navegar por menus ou lembrar de nada de cabeça.

## Stack

**Backend** — Node.js · Express · PostgreSQL · Sequelize · JWT · Cloudinary · Brevo · Groq (IA) · Docker

**Frontend** — React 19 · TypeScript · Vite · React Router · TailwindCSS · Context API

## Estrutura

```
bancadaviva/
├── Back-End/     # API REST (Express + Sequelize + PostgreSQL)
├── Front-End/    # SPA (React + Vite + TypeScript)
└── docker-compose.yml
```

Cada pasta tem seu próprio `README.md` com detalhes de setup e rotas.

## Como rodar

### Com Docker (recomendado)

```bash
git clone https://github.com/SEU-USUARIO/bancadaviva.git
cd bancadaviva
cp .env.exemplo .env   # preenche DB_PASS, JWT_SECRET, CLOUDINARY_*, BREVO_API_KEY
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api/health

As migrations do banco rodam automaticamente na subida do container `backend`.

### Sem Docker

Ver instruções específicas em [`Back-End/README.md`](./Back-End/README.md) e [`Front-End/README.md`](./Front-End/README.md).

## Funcionalidades (Fase 1 — MVP)

- [x] Cadastro, login e recuperação de senha (código por email via Brevo)
- [x] Board de serviços agrupado por status, com busca e filtro
- [x] Criar serviço com categoria (ícone), valor e checklist (padrão ou sugerido por IA)
- [x] Detalhe do serviço: mudar status, checklist (marcar/adicionar/remover), valor editável
- [x] Registrar progresso (foto/nota), editar ou excluir cada registro
- [x] Resumo do histórico por IA (Groq, opcional)
- [x] Painel: métricas, distribuição por status, heatmap de atividade, alerta de serviço parado
- [x] Soft delete (nenhum dado é apagado de verdade)

## Roadmap

**Fase 2** — gravação de áudio como registro de progresso, PWA instalável, cache offline básico.

**Fase 3** — link público pro cliente acompanhar status sem login, backup/exportação, tema claro/escuro refinado.

## Licença

Projeto pessoal — sem licença definida ainda. Se quiser abrir pra uso de terceiros, MIT é uma escolha simples pra esse porte de projeto.
