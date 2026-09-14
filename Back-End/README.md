# BancadaViva — Back-End

## Rodando local (sem Docker)

```
npm install
cp .env.exemplo .env   # preenche DB_*, JWT_SECRET, CLOUDINARY_*, BREVO_API_KEY, GROQ_API_KEY
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
| PATCH | `/api/servicos/:uuidServico/progresso/:uuidRegistro` | sim (edita o texto) |
| DELETE | `/api/servicos/:uuidServico/progresso/:uuidRegistro` | sim (soft delete) |
| POST | `/api/servicos/:uuidServico/resumir-historico` | sim (IA, rate limit próprio) |
| POST | `/api/ia/sugerir-checklist` | sim (IA, rate limit próprio) |
| GET | `/api/dashboard` | sim |

## IA (Groq)

`GROQ_API_KEY` é opcional — sem ela, as rotas de IA respondem 503 com mensagem amigável, o resto do app funciona normal. Conta grátis em [console.groq.com](https://console.groq.com/keys), sem cartão. As rotas de IA têm rate limit próprio (`iaLimiter`, 8 req/min) porque o limite gratuito da Groq é por conta inteira, não por usuário — protege contra estourar a cota se o app receber pico de acesso.
