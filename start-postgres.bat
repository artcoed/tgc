@echo off
echo Starting PostgreSQL...
docker run --name postgres-tgcoin -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tgcoinbackend -p 5432:5432 -d postgres
echo PostgreSQL started on port 5432
echo Database: tgcoinbackend
echo Username: postgres
echo Password: postgres 