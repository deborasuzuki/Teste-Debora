# Documentação da API de Tarefas

## Visão Geral
Esta API fornece endpoints para gerenciar um sistema de tarefas com funcionalidades completas de CRUD, filtros, busca e estatísticas.

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Teste da API
**GET** `/test`

Verifica se a API está funcionando.

**Resposta:**
```json
{
    "message": "API funcionando corretamente",
    "timestamp": "2024-01-01T00:00:00.000000Z",
    "version": "1.0.0"
}
```

### 2. Listar Tarefas
**GET** `/tarefas`

Lista todas as tarefas com paginação e filtros opcionais.

**Parâmetros de Query:**
- `completed` (boolean): Filtrar por status de conclusão
- `priority` (integer): Filtrar por prioridade (1-5)
- `search` (string): Buscar por título ou descrição
- `order_by` (string): Campo para ordenação (padrão: created_at)
- `direction` (string): Direção da ordenação (asc/desc, padrão: desc)
- `per_page` (integer): Itens por página (padrão: 15)

**Exemplo:**
```
GET /api/tarefas?completed=false&priority=5&search=importante&order_by=priority&direction=desc
```

**Resposta:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Tarefa Importante",
            "description": "Descrição da tarefa",
            "completed": false,
            "priority": 5,
            "due_date": "2024-01-15 10:00:00",
            "created_at": "2024-01-01 00:00:00",
            "updated_at": "2024-01-01 00:00:00",
            "status_text": "Pendente",
            "priority_text": "Alta",
            "is_overdue": false
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 15,
        "total": 1
    }
}
```

### 3. Mostrar Tarefa Específica
**GET** `/tarefas/{id}`

Retorna uma tarefa específica pelo ID.

**Resposta:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Tarefa Específica",
        "description": "Descrição da tarefa",
        "completed": false,
        "priority": 3,
        "due_date": null,
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00",
        "status_text": "Pendente",
        "priority_text": "Média",
        "is_overdue": false
    }
}
```

### 4. Criar Tarefa
**POST** `/tarefas`

Cria uma nova tarefa.

**Corpo da Requisição:**
```json
{
    "title": "Nova Tarefa",
    "description": "Descrição opcional da tarefa",
    "priority": 4,
    "due_date": "2024-01-15 10:00:00"
}
```

**Campos Obrigatórios:**
- `title`: Título da tarefa (máximo 255 caracteres)

**Campos Opcionais:**
- `description`: Descrição da tarefa (máximo 1000 caracteres)
- `priority`: Prioridade (1-5, padrão: 1)
- `due_date`: Data de vencimento (deve ser futura)

**Resposta:**
```json
{
    "success": true,
    "message": "Tarefa criada com sucesso",
    "data": {
        "id": 2,
        "title": "Nova Tarefa",
        "description": "Descrição opcional da tarefa",
        "completed": false,
        "priority": 4,
        "due_date": "2024-01-15 10:00:00",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

### 5. Atualizar Tarefa
**PUT/PATCH** `/tarefas/{id}`

Atualiza uma tarefa existente.

**Corpo da Requisição:**
```json
{
    "title": "Título Atualizado",
    "completed": true,
    "priority": 5
}
```

**Resposta:**
```json
{
    "success": true,
    "message": "Tarefa atualizada com sucesso",
    "data": {
        "id": 1,
        "title": "Título Atualizado",
        "description": "Descrição da tarefa",
        "completed": true,
        "priority": 5,
        "due_date": null,
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

### 6. Deletar Tarefa
**DELETE** `/tarefas/{id}`

Remove uma tarefa do sistema.

**Resposta:**
```json
{
    "success": true,
    "message": "Tarefa deletada com sucesso"
}
```

### 7. Alternar Status de Conclusão
**PATCH** `/tarefas/{id}/toggle`

Alterna o status de conclusão de uma tarefa.

**Resposta:**
```json
{
    "success": true,
    "message": "Status da tarefa alterado com sucesso",
    "data": {
        "id": 1,
        "title": "Tarefa",
        "completed": true,
        "priority": 3
    }
}
```

### 8. Estatísticas
**GET** `/estatisticas`

Retorna estatísticas gerais das tarefas.

**Resposta:**
```json
{
    "success": true,
    "data": {
        "total": 10,
        "concluidas": 6,
        "pendentes": 4,
        "atrasadas": 1,
        "percentual_concluido": 60.0
    }
}
```

### 9. Busca
**GET** `/buscar/{termo}`

Busca tarefas por título ou descrição.

**Resposta:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Tarefa de Desenvolvimento",
            "description": "Implementar funcionalidade",
            "completed": false,
            "priority": 4
        }
    ]
}
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **422**: Erro de validação
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## Estrutura de Resposta Padrão

### Sucesso
```json
{
    "success": true,
    "data": {...},
    "message": "Mensagem de sucesso"
}
```

### Erro
```json
{
    "success": false,
    "message": "Mensagem de erro",
    "errors": {...} // Apenas para erros de validação
}
```

## Prioridades

- **1**: Baixa
- **2**: Média-Baixa
- **3**: Média
- **4**: Média-Alta
- **5**: Alta

## Exemplos de Uso

### Frontend JavaScript (Fetch API)

```javascript
// Listar tarefas
const response = await fetch('/api/tarefas');
const data = await response.json();

// Criar tarefa
const newTask = await fetch('/api/tarefas', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: 'Nova Tarefa',
        priority: 3
    })
});

// Atualizar tarefa
const updateTask = await fetch('/api/tarefas/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        completed: true
    })
});

// Deletar tarefa
await fetch('/api/tarefas/1', {
    method: 'DELETE'
});
```

### Frontend JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: '/api'
});

// Listar tarefas
const tarefas = await api.get('/tarefas');

// Criar tarefa
const novaTarefa = await api.post('/tarefas', {
    title: 'Nova Tarefa',
    priority: 4
});

// Atualizar tarefa
await api.put('/tarefas/1', {
    completed: true
});

// Deletar tarefa
await api.delete('/tarefas/1');
```

## Configuração CORS

A API está configurada para aceitar requisições dos seguintes domínios:
- `http://localhost:3000` (React padrão)
- `http://localhost:4200` (Angular padrão)
- `http://localhost:5173` (Vite padrão)
- `http://localhost:8080` (Vue CLI padrão)

Para adicionar novos domínios, edite o arquivo `config/cors.php`.
