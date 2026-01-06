@echo off
REM Script para configurar o banco de dados PostgreSQL no Windows

REM Variáveis (ajuste conforme necessário)
set DB_NAME=inclusio_db
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo Criando banco de dados %DB_NAME%...
createdb -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME%

echo Executando schema...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f database-schema.sql

echo Inserindo dados iniciais...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f seed-data.sql

echo Banco de dados configurado com sucesso!
