import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { ApiService } from './api.service';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodosListResponse } from '../models/todo.interface';
import { of, throwError } from 'rxjs';

describe('TodoService', () => {
  let service: TodoService;
  let mockApiService: jasmine.SpyObj<ApiService>;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Teste 1', completed: false, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: 2, title: 'Teste 2', completed: true, created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z' }
  ];

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'get', 'post', 'put', 'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(TodoService);
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
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

      mockApiService.get.and.returnValue(of(apiResponse));

      service.loadAllTodos().subscribe(todos => {
        expect(todos).toEqual(mockTodos);
      });

      expect(mockApiService.get).toHaveBeenCalledWith('/api/tarefas');

      service.todos$.subscribe(todos => {
        expect(todos).toEqual(mockTodos);
      });
    });

    it('deve propagar erro ao falhar o carregamento', () => {
      const errorMessage = 'Erro na API';
      mockApiService.get.and.returnValue(throwError(() => new Error(errorMessage)));

      service.loadAllTodos().subscribe({
        next: () => fail('deveria falhar'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });
    });
  });

  describe('addTodo', () => {
    it('deve adicionar novo todo e atualizar o estado local quando API retorna {data}', () => {
      const newTodo: CreateTodoRequest = { title: 'Nova Tarefa' };
      const createdTodo: Todo = { id: 3, title: 'Nova Tarefa', completed: false, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z' };

      mockApiService.post.and.returnValue(of({ data: createdTodo } as any));

      service.addTodo(newTodo).subscribe(todo => {
        expect(todo).toEqual(createdTodo);
      });

      expect(mockApiService.post).toHaveBeenCalledWith('/api/tarefas', newTodo);

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
      mockApiService.get.and.returnValue(of(apiResponse));
      service.loadAllTodos().subscribe();

      mockApiService.put.and.returnValue(of(updatedTodo));

      service.updateTodo(1, updates).subscribe(todo => {
        expect(todo).toEqual(updatedTodo);
      });

      expect(mockApiService.put).toHaveBeenCalledWith('/api/tarefas/1', updates);

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
      mockApiService.get.and.returnValue(of(apiResponse));
      service.loadAllTodos().subscribe();

      mockApiService.delete.and.returnValue(of({} as any));

      service.deleteTodo(1).subscribe(() => {
        expect(mockApiService.delete).toHaveBeenCalledWith('/api/tarefas/1');
      });

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
      mockApiService.get.and.returnValue(of(apiResponse));
      service.loadAllTodos().subscribe();

      const updatedTodo: Todo = { id: 1, title: 'Teste 1', completed: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' };
      mockApiService.put.and.returnValue(of(updatedTodo));

      service.toggleTodoStatus(1, true).subscribe(todo => {
        expect(todo).toEqual(updatedTodo);
      });

      expect(mockApiService.put).toHaveBeenCalledWith('/api/tarefas/1', { completed: true });
    });
  });
});
