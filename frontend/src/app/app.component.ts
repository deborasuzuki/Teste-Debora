import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TodoFormComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Todo List';
  todos: Todo[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
    this.subscribeToTodos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTodos(): void {
    this.loading = true;
    this.todoService.loadAllTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (todos) => {
          this.todos = todos;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar tarefas:', error);
          this.loading = false;
        }
      });
  }

  private subscribeToTodos(): void {
    this.todoService.todos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(todos => {
        this.todos = todos;
      });
  }

  onAddTodo(todoData: { title: string }): void {
    this.todoService.addTodo(todoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTodo) => {
        },
        error: (error) => {
          console.error('Erro ao adicionar tarefa:', error);
        }
      });
  }

  onToggleStatus(event: { id: number; completed: boolean }): void {
    this.todoService.toggleTodoStatus(event.id, event.completed)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
        }
      });
  }

  onRemoveTodo(id: number): void {
    this.todoService.deleteTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
        },
        error: (error) => {
          console.error('Erro ao remover tarefa:', error);
        }
      });
  }
}
