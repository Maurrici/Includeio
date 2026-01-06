#!/bin/bash
# Script para configurar o banco de dados PostgreSQL

# Variáveis (ajuste conforme necessário)
DB_NAME="inclusio_db"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "Criando banco de dados $DB_NAME..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME

echo "Executando schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database-schema.sql

echo "Inserindo dados iniciais..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f seed-data.sql

echo "Banco de dados configurado com sucesso!"
