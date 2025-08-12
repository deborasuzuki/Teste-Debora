import { Component, EventEmitter, inject, Output } from '@angular/core';
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
  public form!: FormGroup;
  public isSubmitting = false;

  private formBuilder = inject(FormBuilder);

  @Output() addTodo = new EventEmitter<CreateTodoRequest>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(200)
      ]]
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const trimmedTitle = this.form.get('title')?.value.trim();

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
