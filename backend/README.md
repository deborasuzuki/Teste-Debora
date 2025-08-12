# Sistema de Tarefas - Backend Laravel

Um sistema robusto de gerenciamento de tarefas desenvolvido com Laravel 11, seguindo as melhores práticas de desenvolvimento e arquitetura.

## 🚀 Características

- **API RESTful completa** com endpoints para CRUD de tarefas
- **Validação robusta** de dados de entrada
- **Arquitetura em camadas** (Controller, Service, Model)
- **Testes unitários e de feature** com PHPUnit
- **Configuração CORS segura** para comunicação com frontend
- **Banco de dados SQLite** para desenvolvimento
- **Documentação completa** da API
- **Logging e tratamento de erros** adequados
- **Paginação e filtros** avançados
- **Sistema de prioridades** (1-5)
- **Datas de vencimento** com validação
- **Estatísticas** em tempo real

## 🏗️ Arquitetura

```
app/
├── Http/
│   ├── Controllers/     # Controllers da API
│   ├── Middleware/      # Middlewares (CORS)
│   └── Requests/        # Validação de dados
├── Models/              # Modelos Eloquent
├── Services/            # Lógica de negócio
└── Http/Resources/      # Transformação de dados
```

## 📋 Pré-requisitos

- PHP 8.2+
- Composer
- Laravel 11
- SQLite (incluído)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd backend
```

2. **Instale as dependências**
```bash
composer install
```

3. **Configure o ambiente**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure o banco de dados**
```bash
# O projeto já está configurado para usar SQLite
# O arquivo database/database.sqlite será criado automaticamente
```

5. **Execute as migrations**
```bash
php artisan migrate
```

6. **Popule o banco com dados iniciais**
```bash
php artisan db:seed
```

7. **Inicie o servidor**
```bash
php artisan serve
```

A API estará disponível em: `http://localhost:8000/api`

## 🧪 Executando os Testes

```bash
# Executar todos os testes
php artisan test

# Executar testes específicos
php artisan test --filter=TarefaTest
php artisan test --filter=TarefaControllerTest
php artisan test --filter=TarefaServiceTest

# Executar com cobertura (se disponível)
php artisan test --coverage
```

## 📚 Endpoints da API

### Tarefas
- `GET /api/tarefas` - Listar tarefas
- `GET /api/tarefas/{id}` - Mostrar tarefa específica
- `POST /api/tarefas` - Criar nova tarefa
- `PUT /api/tarefas/{id}` - Atualizar tarefa
- `DELETE /api/tarefas/{id}` - Deletar tarefa
- `PATCH /api/tarefas/{id}/toggle` - Alternar status

### Funcionalidades Extras
- `GET /api/estatisticas` - Estatísticas das tarefas
- `GET /api/buscar/{termo}` - Busca por texto
- `GET /api/test` - Teste da API

## 🔧 Configuração CORS

O sistema está configurado para aceitar requisições dos seguintes domínios:
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)
- `http://localhost:8080` (Vue CLI)

Para adicionar novos domínios, edite `config/cors.php`.

## 📖 Documentação Completa

Consulte o arquivo `API_DOCUMENTATION.md` para documentação detalhada da API, incluindo exemplos de uso e códigos de resposta.

## 🎯 Exemplo de Uso

### Frontend JavaScript

```javascript
// Listar tarefas
const response = await fetch('/api/tarefas');
const data = await response.json();

// Criar tarefa
const newTask = await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Nova Tarefa',
        priority: 3,
        description: 'Descrição da tarefa'
    })
});
```

## 🏛️ Estrutura de Dados

### Tarefa
- `id` - Identificador único
- `title` - Título da tarefa (obrigatório)
- `description` - Descrição opcional
- `completed` - Status de conclusão
- `priority` - Prioridade (1-5)
- `due_date` - Data de vencimento
- `created_at` - Data de criação
- `updated_at` - Data de atualização

## 🔍 Funcionalidades Avançadas

- **Filtros**: Por status, prioridade, data
- **Busca**: Texto em título e descrição
- **Ordenação**: Por qualquer campo
- **Paginação**: Configurável
- **Validação**: Regras de negócio robustas
- **Transações**: Operações seguras no banco
- **Logging**: Rastreamento de operações

## 🚨 Tratamento de Erros

- **Validação**: Erros 422 com detalhes
- **Não encontrado**: Erro 404 padronizado
- **Erro interno**: Erro 500 com logs
- **Respostas consistentes**: Formato padronizado

## 📊 Monitoramento

- Logs de todas as operações
- Estatísticas em tempo real
- Rastreamento de erros
- Métricas de performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Execute os testes
3. Abra uma issue no repositório

## 🔄 Atualizações

- **v1.0.0**: Estrutura inicial com CRUD básico
- **v1.1.0**: Adicionado sistema de prioridades e datas
- **v1.2.0**: Implementado filtros e busca avançada
- **v1.3.0**: Adicionado testes e documentação completa


**Refator do backend realidado com suporte de IA.