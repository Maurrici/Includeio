# 🐳 Guia de Uso com Docker

Este guia explica como executar a API Inclusio usando Docker Compose.

## 📦 Pré-requisitos

- Docker instalado
- Docker Compose instalado

## 🚀 Executando

### 1. Iniciar os serviços

Na pasta `backend/`, execute:

```bash
docker-compose up -d --build
```

Este comando irá:
- ✅ Construir a imagem da API
- ✅ Baixar e iniciar o PostgreSQL
- ✅ Criar o banco de dados automaticamente
- ✅ Executar o schema SQL
- ✅ Inserir os dados iniciais (aplicações, tipos, fluxos)
- ✅ Iniciar a API

### 2. Verificar se está funcionando

Aguarde alguns segundos e acesse:

- **API**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### 3. Testar a API

```bash
# Listar aplicações
curl http://localhost:8000/applications

# Listar tipos de aplicação
curl http://localhost:8000/application-types

# Obter tipos de uma aplicação específica (ex: WhatsApp - ID 1)
curl http://localhost:8000/applications/1/types

# Obter fluxos de uma aplicação
curl http://localhost:8000/applications/1/flows
```

## 📋 Comandos Úteis

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas API
docker-compose logs -f api

# Apenas banco de dados
docker-compose logs -f db
```

### Parar os serviços

```bash
docker-compose down
```

### Parar e remover volumes (limpar dados do banco)

```bash
docker-compose down -v
```

### Reiniciar os serviços

```bash
docker-compose restart
```

### Reconstruir após mudanças no código

```bash
docker-compose up -d --build
```

### Acessar o banco de dados

```bash
# Conectar ao PostgreSQL via psql
docker-compose exec db psql -U inclusio_user -d inclusio_db

# Ou usando docker exec
docker exec -it inclusio_db psql -U inclusio_user -d inclusio_db
```

### Executar comandos na API

```bash
# Acessar shell do container da API
docker-compose exec api bash

# Executar comandos Python
docker-compose exec api python -c "from database import db; print('OK')"
```

## 🔧 Configuração

### Variáveis de Ambiente

As variáveis estão configuradas no `docker-compose.yml`. Para alterar:

**Banco de dados:**
- `POSTGRES_USER`: inclusio_user
- `POSTGRES_PASSWORD`: inclusio_password
- `POSTGRES_DB`: inclusio_db

**API:**
- `DATABASE_URL`: postgresql://inclusio_user:inclusio_password@db:5432/inclusio_db
- `API_HOST`: 0.0.0.0
- `API_PORT`: 8000

### Portas

- **API**: 8000 (http://localhost:8000)
- **PostgreSQL**: 5432 (localhost:5432)

## 🐛 Troubleshooting

### API não inicia

1. Verifique os logs: `docker-compose logs api`
2. Verifique se o banco está saudável: `docker-compose ps`
3. Aguarde alguns segundos para o banco inicializar completamente

### Erro de conexão com banco

1. Verifique se o banco está rodando: `docker-compose ps db`
2. Verifique os logs do banco: `docker-compose logs db`
3. Aguarde o healthcheck passar (pode levar alguns segundos)

### Limpar tudo e começar do zero

```bash
# Parar e remover tudo
docker-compose down -v

# Reconstruir e iniciar
docker-compose up -d --build
```

### Verificar se o banco foi inicializado corretamente

```bash
docker-compose exec db psql -U inclusio_user -d inclusio_db -c "SELECT COUNT(*) FROM applications;"
```

Deve retornar 15 (número de aplicações inseridas).

## 📝 Estrutura dos Arquivos Docker

```
backend/
├── Dockerfile              # Imagem da API
├── docker-compose.yml      # Orquestração dos serviços
├── .dockerignore           # Arquivos ignorados no build
├── database-schema.sql     # Schema do banco (executado automaticamente)
└── seed-data.sql           # Dados iniciais (executado automaticamente)
```

## 🎯 Próximos Passos

Após iniciar os serviços, você pode:

1. Acessar a documentação interativa em http://localhost:8000/docs
2. Testar os endpoints da API
3. Integrar com o frontend
4. Desenvolver novas funcionalidades
