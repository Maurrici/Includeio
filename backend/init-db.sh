#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U $POSTGRES_USER -d $POSTGRES_DB -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing schema and seed data"

# Execute schema
psql -h db -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/01-schema.sql

# Execute seed data
psql -h db -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/02-seed-data.sql

echo "Database initialization completed!"
