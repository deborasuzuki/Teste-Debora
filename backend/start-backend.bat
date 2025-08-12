@echo off
setlocal
cd /d %~dp0

php --version >nul 2>&1 || (echo PHP nao encontrado. Instale e adicione ao PATH. & pause & exit /b 1)

REM Limpar caches para garantir rotas atualizadas
php artisan optimize:clear

REM Subir servidor na porta 8001 ligado ao localhost IPv4
php artisan serve --host=127.0.0.1 --port=8001

endlocal
