import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateTodoRequest } from '../../models/todo.interface';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  @Output() addTodo = new EventEmitter<CreateTodoRequest>();
  
  form: FormGroup;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(1), 
        Validators.maxLength(200)
      ]]
    });
  }

  get titleControl() {
    return this.form.get('title');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const trimmedTitle = this.titleControl?.value.trim();

    if (!trimmedTitle || trimmedTitle.length < 3) {
      return;
    }

    this.isSubmitting = true;
    this.addTodo.emit({ title: trimmedTitle });
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({ title: '' });
    this.form.markAsUntouched();
    this.isSubmitting = false;
  }
}
