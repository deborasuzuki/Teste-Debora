import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodosListResponse } from '../models/todo.interface';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Teste 1', completed: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: 2, title: 'Teste 2', completed: true, created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAllTodos', () => {
    it('deve carregar todos da API e atualizar o estado local', () => {
      const apiResponse: TodosListResponse = {
        success: true,
        data: mockTodos,
        pagination: { current_page: 1, last_page: 1, per_page: 10, total: 2 }
      };

      service.loadAllTodos().subscribe(todos => {
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne('/api/tarefas');
      expect(req.request.method).toBe('GET');
      req.flush(apiResponse);

      service.todos$.subscribe(todos => {
        expect(todos).toEqual(mockTodos);
      });
    });

    it('deve propagar erro ao falhar o carregamento', () => {
      service.loadAllTodos().subscribe({
        next: () => fail('deveria falhar'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/tarefas');
      expect(req.request.method).toBe('GET');
      req.flush({ message: 'Erro na API' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('addTodo', () => {
    it('deve adicionar novo todo e atualizar o estado local quando API retorna {data}', () => {
      const newTodo: CreateTodoRequest = { title: 'Nova Tarefa' };
      const createdTodo: Todo = { id: 3, title: 'Nova Tarefa', completed: false, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z' };

      service.addTodo(newTodo).subscribe(todo => {
        expect(todo).toEqual(createdTodo);
      });

      const req = httpMock.expectOne('/api/tarefas');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTodo);
      req.flush({ data: createdTodo } as any);

      service.todos$.subscribe(todos => {
        expect(todos[0]).toEqual(createdTodo);
      });
    });
  });

  describe('updateTodo', () => {
    it('deve atualizar um todo existente e refletir no estado local', () => {
      const updates: UpdateTodoRequest = { completed: true };
      const updatedTodo: Todo = { id: 1, title: 'Teste 1', completed: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-04T00:00:00Z' };
      const apiResponse: TodosListResponse = {
        success: true,
        data: mockTodos,
        pagination: { current_page: 1, last_page: 1, per_page: 10, total: 2 }
      };

      service.loadAllTodos().subscribe();
      const req1 = httpMock.expectOne('/api/tarefas');
      expect(req1.request.method).toBe('GET');
      req1.flush(apiResponse);

      service.updateTodo(1, updates).subscribe(todo => {
        expect(todo).toEqual(updatedTodo);
      });

      const req2 = httpMock.expectOne('/api/tarefas/1');
      expect(req2.request.method).toBe('PUT');
      expect(req2.request.body).toEqual(updates);
      req2.flush(updatedTodo);

      service.todos$.subscribe(todos => {
        const t1 = todos.find(t => t.id === 1);
        expect(t1?.completed).toBeTrue();
      });
    });
  });

  describe('deleteTodo', () => {
    it('deve deletar um todo e remover do estado local', () => {
      const apiResponse: TodosListResponse = {
        success: true,
        data: mockTodos,
        pagination: { current_page: 1, last_page: 1, per_page: 10, total: 2 }
      };
      service.loadAllTodos().subscribe();
      const req1 = httpMock.expectOne('/api/tarefas');
      expect(req1.request.method).toBe('GET');
      req1.flush(apiResponse);

      service.deleteTodo(1).subscribe(() => {});

      const req2 = httpMock.expectOne('/api/tarefas/1');
      expect(req2.request.method).toBe('DELETE');
      req2.flush({} as any);

      service.todos$.subscribe(todos => {
        expect(todos.find(t => t.id === 1)).toBeUndefined();
      });
    });
  });

  describe('toggleTodoStatus', () => {
    it('deve alternar o status do todo via updateTodo', () => {
      const apiResponse: TodosListResponse = {
        success: true,
        data: mockTodos,
        pagination: { current_page: 1, last_page: 1, per_page: 10, total: 2 }
      };
      service.loadAllTodos().subscribe();
      const req1 = httpMock.expectOne('/api/tarefas');
      expect(req1.request.method).toBe('GET');
      req1.flush(apiResponse);

      const updatedTodo: Todo = { id: 1, title: 'Teste 1', completed: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' };

      service.toggleTodoStatus(1, true).subscribe(todo => {
        expect(todo).toEqual(updatedTodo);
      });

      const req2 = httpMock.expectOne('/api/tarefas/1');
      expect(req2.request.method).toBe('PUT');
      expect(req2.request.body).toEqual({ completed: true });
      req2.flush(updatedTodo);
    });
  });
});
