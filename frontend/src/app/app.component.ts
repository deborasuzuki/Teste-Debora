import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { Todo } from './models/todo.interface';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TodoFormComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Lista de Tarefas';
  public todos: Todo[] = [];
  public loading = false;

  private destroy$ = new Subject<void>();
  private todoService = inject(TodoService);

  constructor() {}
  
  ngOnInit() {
    this.loadTodos();
    this.subscribeToTodos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onAddTodo(todoData: { title: string }): void {
    this.todoService.addTodo(todoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.announceStatus(`Tarefa "${todoData.title}" adicionada com sucesso`);
        },
        error: (error) => {
          console.error('Erro ao adicionar tarefa:', error);
          this.announceStatus('Erro ao adicionar tarefa');
        }
      });
  }

  public onToggleStatus(event: { id: number; completed: boolean }): void {
    const status = event.completed ? 'concluída' : 'marcada como não concluída';
    this.todoService.toggleTodoStatus(event.id, event.completed)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.announceStatus(`Tarefa ${status}`);
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          this.announceStatus('Erro ao atualizar tarefa');
        }
      });
  }

 public onRemoveTodo(id: number): void {
    this.todoService.deleteTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.announceStatus('Tarefa removida com sucesso');
        },
        error: (error) => {
          console.error('Erro ao remover tarefa:', error);
          this.announceStatus('Erro ao remover tarefa');
        }
      });
  }

  private loadTodos(): void {
    this.loading = true;
    this.todoService.loadAllTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (todos) => {
          this.todos = todos;
          this.loading = false;
          this.announceStatus(`Carregadas ${todos.length} tarefas`);
        },
        error: (error) => {
          console.error('Erro ao carregar tarefas:', error);
          this.loading = false;
          this.announceStatus('Erro ao carregar tarefas');
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

  private announceStatus(message: string): void {
    const statusElement = document.getElementById('status-messages');
    if (statusElement) {
      statusElement.textContent = message;
      setTimeout(() => {
        statusElement.textContent = '';
      }, 300);
    }
  }
}
