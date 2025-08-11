@echo off
echo ========================================
echo   Configuracao do Sistema de Tarefas
echo ========================================
echo.

echo Verificando se PHP esta instalado...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: PHP nao encontrado!
    echo Por favor, instale o PHP 8.2+ primeiro
    echo Consulte INSTALACAO.md para instrucoes
    pause
    exit /b 1
)

echo Verificando se Composer esta instalado...
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Composer nao encontrado!
    echo Por favor, instale o Composer primeiro
    echo Consulte INSTALACAO.md para instrucoes
    pause
    exit /b 1
)

echo.
echo Instalando dependencias...
composer install

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo Copiando arquivo de ambiente...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado
) else (
    echo Arquivo .env ja existe
)

echo.
echo Gerando chave da aplicacao...
php artisan key:generate

echo.
echo Executando migrations...
php artisan migrate

echo.
echo Populando banco com dados iniciais...
php artisan db:seed

echo.
echo ========================================
echo   Configuracao concluida com sucesso!
echo ========================================
echo.
echo Para iniciar o servidor, execute:
echo   php artisan serve
echo.
echo Para executar os testes:
echo   php artisan test
echo.
echo A API estara disponivel em:
echo   http://localhost:8000/api
echo.
pause
