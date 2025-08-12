import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.interface';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleStatus = new EventEmitter<{ id: number; completed: boolean }>();
  @Output() remove = new EventEmitter<number>();

  onToggleStatus(): void {
    if (this.todo?.id == null) {
      return;
    }
    this.todo.completed = !this.todo.completed;
    this.toggleStatus.emit({ 
      id: this.todo.id, 
      completed: this.todo.completed
    });
  }

  onRemove(): void {
    this.remove.emit(this.todo.id);
  }
}
