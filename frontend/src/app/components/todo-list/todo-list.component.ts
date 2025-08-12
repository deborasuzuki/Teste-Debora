import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.interface';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() loading = false;
  @Output() toggleStatus = new EventEmitter<{ id: number; completed: boolean }>();
  @Output() remove = new EventEmitter<number>();


  onToggleStatus(event: { id: number; completed: boolean }): void {
    this.toggleStatus.emit(event);
  }

  onRemove(id: number): void {
    this.remove.emit(id);
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}
