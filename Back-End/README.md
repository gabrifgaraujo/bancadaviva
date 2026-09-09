# BancadaViva — Back-End

## Rodando local (sem Docker)

```
npm install
cp .env.exemplo .env   # preenche DB_*, JWT_SECRET, CLOUDINARY_*, BREVO_API_KEY
npx sequelize-cli db:migrate
npm run dev
```

## Rodando com Docker (recomendado)

Na raiz do projeto:

```
cp .env .env   # preenche o .env da raiz
docker compose up
```

As migrations rodam automaticamente antes do `npm run dev` (ver `command` no `docker-compose.yml`).

## Rotas

| Método | Rota | Auth |
|---|---|---|
| POST | `/api/auth/register` | não |
| POST | `/api/auth/login` | não |
| GET | `/api/auth/me` | sim |
| POST | `/api/auth/forgot-password` | não |
| POST | `/api/auth/reset-password` | não |
| GET | `/api/servicos` | sim |
| POST | `/api/servicos` | sim |
| GET | `/api/servicos/:uuid` | sim |
| PATCH | `/api/servicos/:uuid` | sim |
| DELETE | `/api/servicos/:uuid` | sim (soft delete) |
| GET | `/api/servicos/:uuidServico/progresso` | sim |
| POST | `/api/servicos/:uuidServico/progresso` | sim (multipart se foto/áudio) |
