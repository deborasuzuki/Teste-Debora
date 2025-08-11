# Instruções de Instalação - Windows

## Pré-requisitos

### 1. Instalar PHP 8.2+
1. Baixe o PHP para Windows em: https://windows.php.net/download/
2. Escolha a versão "Thread Safe" (TS) x64
3. Extraia para `C:\php`
4. Adicione `C:\php` ao PATH do sistema
5. Copie `php.ini-development` para `php.ini`
6. Descomente as extensões necessárias no `php.ini`:
   ```ini
   extension=pdo_sqlite
   extension=sqlite3
   extension=mbstring
   extension=openssl
   extension=tokenizer
   extension=fileinfo
   extension=curl
   ```

### 2. Instalar Composer
1. Baixe o instalador do Composer: https://getcomposer.org/download/
2. Execute o instalador e siga as instruções
3. Verifique a instalação: `composer --version`

### 3. Verificar Instalação
```bash
php --version
composer --version
```

## Configuração do Projeto

Após instalar PHP e Composer, execute os seguintes comandos:

```bash
# 1. Instalar dependências
composer install

# 2. Copiar arquivo de ambiente
copy .env.example .env

# 3. Gerar chave da aplicação
php artisan key:generate

# 4. Executar migrations
php artisan migrate

# 5. Popular banco com dados iniciais
php artisan db:seed

# 6. Iniciar servidor
php artisan serve
```

## Testes

```bash
# Executar todos os testes
php artisan test

# Executar testes específicos
php artisan test --filter=TarefaTest
```

## Estrutura do Projeto

O projeto foi reestruturado com:

- ✅ **Modelo Tarefa** com Eloquent
- ✅ **Controller** com validação e tratamento de erros
- ✅ **Service** para lógica de negócio
- ✅ **Request** para validação de dados
- ✅ **Resource** para transformação de dados
- ✅ **Migration** para estrutura do banco
- ✅ **Seeder** para dados iniciais
- ✅ **Testes** unitários e de feature
- ✅ **Configuração CORS** segura
- ✅ **Documentação** completa da API

## Endpoints Disponíveis

- `GET /api/test` - Teste da API
- `GET /api/tarefas` - Listar tarefas
- `POST /api/tarefas` - Criar tarefa
- `GET /api/tarefas/{id}` - Mostrar tarefa
- `PUT /api/tarefas/{id}` - Atualizar tarefa
- `DELETE /api/tarefas/{id}` - Deletar tarefa
- `PATCH /api/tarefas/{id}/toggle` - Alternar status
- `GET /api/estatisticas` - Estatísticas
- `GET /api/buscar/{termo}` - Busca

## Configuração CORS

A API está configurada para aceitar requisições de:
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)
- `http://localhost:8080` (Vue CLI)

## Banco de Dados

- **SQLite** configurado por padrão
- Arquivo: `database/database.sqlite`
- Migrations automáticas
- Dados iniciais via seeder

## Solução de Problemas

### Erro: "php não é reconhecido"
- Verifique se PHP está no PATH
- Reinicie o terminal após adicionar ao PATH

### Erro: "composer não é reconhecido"
- Reinstale o Composer
- Verifique se está no PATH

### Erro de permissão
- Execute o terminal como administrador
- Verifique permissões da pasta do projeto

### Erro de extensões PHP
- Verifique se as extensões estão habilitadas no `php.ini`
- Reinicie o servidor após alterações

## Próximos Passos

1. Instalar PHP e Composer
2. Executar comandos de configuração
3. Testar a API
4. Integrar com o frontend
5. Executar testes para validar funcionalidades

## Suporte

Para problemas específicos:
1. Verifique os logs em `storage/logs/`
2. Execute `php artisan config:clear`
3. Verifique se todas as extensões PHP estão habilitadas
4. Consulte a documentação da API em `API_DOCUMENTATION.md`
