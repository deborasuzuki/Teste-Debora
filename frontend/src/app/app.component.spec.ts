import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoService } from './services/todo.service';
import { of, Subject, throwError } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', [
      'loadAllTodos',
      'addTodo',
      'toggleTodoStatus',
      'deleteTodo'
    ], {
      todos$: of([])
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: TodoService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve carregar todos e assinar observable', () => {
    todoServiceSpy.loadAllTodos.and.returnValue(of([]));
    fixture.detectChanges(); // dispara ngOnInit
    expect(todoServiceSpy.loadAllTodos).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('loadTodos deve marcar loading e desmarcar em erro', () => {
    todoServiceSpy.loadAllTodos.and.returnValue(throwError(() => new Error('falha')));
    component['loadTodos']();
    expect(component.loading).toBeFalse();
  });

  it('onAddTodo deve delegar para o serviço', () => {
    todoServiceSpy.addTodo.and.returnValue(of({} as any));
    component.onAddTodo({ title: 'X' });
    expect(todoServiceSpy.addTodo).toHaveBeenCalledWith({ title: 'X' });
  });

  it('onToggleStatus deve delegar para o serviço', () => {
    todoServiceSpy.toggleTodoStatus.and.returnValue(of({} as any));
    component.onToggleStatus({ id: 1, completed: true });
    expect(todoServiceSpy.toggleTodoStatus).toHaveBeenCalledWith(1, true);
  });

  it('onRemoveTodo deve delegar para o serviço', () => {
    todoServiceSpy.deleteTodo.and.returnValue(of({} as any));
    component.onRemoveTodo(1);
    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
  });
});


