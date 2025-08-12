import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { Todo } from '../../models/todo.interface';
import { By } from '@angular/platform-browser';

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;

  const todos: Todo[] = [
    { id: 1, title: 'A', completed: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 2, title: 'B', completed: true, created_at: '2024-01-02', updated_at: '2024-01-02' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar estado de carregamento quando loading=true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loading = fixture.debugElement.query(By.css('.loading-state'));
    expect(loading).toBeTruthy();
  });

  it('deve mostrar estado vazio quando !loading e sem todos', () => {
    component.loading = false;
    component.todos = [];
    fixture.detectChanges();
    const empty = fixture.debugElement.query(By.css('.empty-state'));
    expect(empty).toBeTruthy();
  });

  it('deve renderizar lista quando há itens', () => {
    component.loading = false;
    component.todos = todos;
    fixture.detectChanges();
    const list = fixture.debugElement.queryAll(By.css('app-todo-item'));
    expect(list.length).toBe(2);
  });

  it('deve repassar eventos de toggleStatus e remove', () => {
    spyOn(component.toggleStatus, 'emit');
    spyOn(component.remove, 'emit');
    component.loading = false;
    component.todos = todos;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('app-todo-item'));
    // Dispara eventos manualmente nos componentes filhos
    items[0].triggerEventHandler('toggleStatus', { id: 1, completed: true });
    items[1].triggerEventHandler('remove', 2);

    expect(component.toggleStatus.emit).toHaveBeenCalledWith({ id: 1, completed: true });
    expect(component.remove.emit).toHaveBeenCalledWith(2);
  });

  it('trackByTodoId deve retornar id', () => {
    expect(component.trackByTodoId(0, todos[0])).toBe(1);
  });
});


