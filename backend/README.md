# Inclusio API

API FastAPI para avaliação de acessibilidade de aplicações.

## 🚀 Início Rápido com Docker

A forma mais fácil de executar a API é usando Docker Compose:

```bash
# Na pasta backend/
docker-compose up -d --build
```

Isso irá:
- Criar e iniciar o container do PostgreSQL
- Criar e iniciar o container da API
- Executar automaticamente o schema e dados iniciais do banco
- Expor a API em `http://localhost:8000`

### Parar os serviços

```bash
docker-compose down
```

### Parar e remover volumes (limpar dados)

```bash
docker-compose down -v
```

### Ver logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas da API
docker-compose logs -f api

# Logs apenas do banco
docker-compose logs -f db
```

## 📋 Requisitos (Desenvolvimento Local)

Se preferir executar localmente sem Docker:

- Python 3.8+
- PostgreSQL 12+
- pip ou poetry

## 🔧 Instalação Local

1. Instale as dependências:

```bash
pip install -r requirements.txt
```

2. Configure o banco de dados PostgreSQL:

```bash
# Crie o banco de dados
createdb inclusio_db

# Execute o schema
psql -d inclusio_db -f database-schema.sql

# Execute os dados iniciais
psql -d inclusio_db -f seed-data.sql
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/inclusio_db
API_HOST=0.0.0.0
API_PORT=8000
```

Substitua `user`, `password` e `localhost:5432` pelos valores do seu banco de dados.

## ▶️ Executando a API Localmente

```bash
# Desenvolvimento
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Produção
uvicorn main:app --host 0.0.0.0 --port 8000
```

A API estará disponível em `http://localhost:8000`

## Documentação

Após iniciar a API, acesse:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Aplicações

- `GET /applications` - Lista todas as aplicações
- `GET /applications/{application_id}` - Obtém uma aplicação específica
- `GET /applications/{application_id}/flows` - Lista os fluxos disponíveis para uma aplicação
- `GET /applications/{application_id}/with-flows` - Obtém aplicação com seus fluxos

### Fluxos

- `GET /flows` - Lista todos os fluxos
- `GET /flows/{flow_id}` - Obtém um fluxo específico

### Avaliações

- `GET /evaluations` - Lista todas as avaliações (com paginação)
- `GET /evaluations/{evaluation_id}` - Obtém uma avaliação específica com detalhes
- `POST /evaluations` - Cria uma nova avaliação
- `DELETE /evaluations/{evaluation_id}` - Deleta uma avaliação

## Estrutura do Projeto

```
backend/
├── main.py                 # Aplicação FastAPI principal
├── config.py               # Configurações
├── database.py             # Conexão com banco de dados
├── models.py               # Modelos Pydantic
├── routers/                # Rotas da API
│   ├── applications.py     # Rotas de aplicações
│   ├── flows.py            # Rotas de fluxos
│   └── evaluations.py      # Rotas de avaliações
├── database-schema.sql     # Schema do banco de dados
├── seed-data.sql           # Dados iniciais
└── requirements.txt        # Dependências Python
```

## Modelo de Dados

### Aplicações

As aplicações são pré-definidas e incluem:
- WhatsApp, Netflix, MercadoLivre, iFood, Instagram, Spotify, Google Maps, Uber, Nubank, Microsoft Teams, Zoom, Notion, LinkedIn, GitHub, Figma

Cada aplicação tem:
- Nome
- Tipo (Aplicativo Mobile, Software ou Web)
- Link

### Fluxos

Fluxos pré-definidos que podem ser avaliados:
- Login e Autenticação
- Busca e Filtros
- Navegação Principal
- Formulários
- Listagem de Itens
- Detalhes do Produto/Serviço
- Carrinho de Compras
- Perfil do Usuário
- Configurações
- Notificações
- Upload de Arquivos
- Chat e Mensagens
- Reprodução de Mídia
- Compartilhamento
- Pagamento

### Avaliações

Uma avaliação contém:
- ID da aplicação
- ID do fluxo
- Pontuações (total, normalizada, geral)
- Seções com pontuações e comentários
- Respostas das perguntas

## Exemplo de Uso

### Criar uma avaliação

```bash
curl -X POST "http://localhost:8000/evaluations" \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": 1,
    "flow_id": 1,
    "totalRawScore": 100,
    "normalizedScore": 8.0,
    "overallScore": 8.0,
    "sectionScores": [
      {
        "sectionId": "perception",
        "sectionName": "Percepção",
        "rawScore": 20,
        "normalizedScore": 8.0,
        "comment": "Boa acessibilidade",
        "questions": [
          {"questionId": "q1", "score": 4},
          {"questionId": "q2", "score": 4}
        ]
      }
    ]
  }'
```

### Listar aplicações

```bash
curl "http://localhost:8000/applications"
```

### Obter fluxos de uma aplicação

```bash
curl "http://localhost:8000/applications/1/flows"
```

## Health Check

```bash
curl "http://localhost:8000/health"
```
