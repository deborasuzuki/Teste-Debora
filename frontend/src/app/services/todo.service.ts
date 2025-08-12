import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodosListResponse } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadAllTodos(): Observable<Todo[]> {
    return this.apiService.get<TodosListResponse>('/api/tarefas')
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.todosSubject.next(response.data);
            return response.data;
          } else {
            this.todosSubject.next([]);
            return [];
          }
        })
      );
  }

  addTodo(todo: CreateTodoRequest): Observable<Todo> {
    return this.apiService.post<any>('/api/tarefas', todo)
      .pipe(
        switchMap((response: any) => {
          const created = response && typeof response === 'object' && 'data' in response
            ? (response as any).data
            : response;
          const mergedNewTodo: Todo = { ...created, title: created?.title ?? todo.title } as Todo;

          if (mergedNewTodo && typeof (mergedNewTodo as any).id === 'number') {
            const currentTodos = this.todosSubject.value;
            this.todosSubject.next([mergedNewTodo, ...currentTodos]);
            return of(mergedNewTodo);
          }

          return this.loadAllTodos().pipe(map(() => mergedNewTodo));
        })
      );
  }

  updateTodo(id: number, updates: UpdateTodoRequest): Observable<Todo> {
    return this.apiService.put<Todo>(`/api/tarefas/${id}`, updates)
      .pipe(
        map(updatedTodo => {
          const currentTodos = this.todosSubject.value;
          const updatedTodos = currentTodos.map(existingTodo => {
            if (existingTodo.id !== id) {
              return existingTodo;
            }
            return { ...existingTodo, ...updatedTodo } as Todo;
          });
          this.todosSubject.next(updatedTodos);
          return updatedTodos.find(t => t.id === id)!;
        })
      );
  }

  deleteTodo(id: number): Observable<Todo> {
    return this.apiService.delete<Todo>(`/api/tarefas/${id}`)
      .pipe(
        map(response => {
          const currentTodos = this.todosSubject.value;
          const filteredTodos = currentTodos.filter(todo => todo.id !== id);
          this.todosSubject.next(filteredTodos);
          return response;
        })
      );
  }

  toggleTodoStatus(id: number, completed: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed }).pipe(
      map(updatedTodo => {
        return updatedTodo;
      })
    );
  }

}
