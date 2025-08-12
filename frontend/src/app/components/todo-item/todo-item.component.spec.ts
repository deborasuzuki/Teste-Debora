import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.interface';

describe('TodoItemComponent', () => {
  let fixture: ComponentFixture<TodoItemComponent>;
  let component: TodoItemComponent;

  const baseTodo: Todo = {
    id: 1,
    title: 'Tarefa',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = { ...baseTodo };
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve alternar completed e emitir toggleStatus', () => {
    const spy = spyOn(component.toggleStatus, 'emit');
    component.onToggleStatus();
    expect(component.todo.completed).toBeTrue();
    expect(spy).toHaveBeenCalledWith({ id: 1, completed: true });
  });

  it('não deve emitir toggleStatus se id nulo/indefinido', () => {
    const spy = spyOn(component.toggleStatus, 'emit');
    component.todo = { ...baseTodo, id: undefined as unknown as number };
    component.onToggleStatus();
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve emitir remove com id', () => {
    const spy = spyOn(component.remove, 'emit');
    component.onRemove();
    expect(spy).toHaveBeenCalledWith(1);
  });
});


