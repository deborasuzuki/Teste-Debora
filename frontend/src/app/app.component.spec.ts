import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoService } from './services/todo.service';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { Todo } from './models/todo.interface';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let todosSubject: Subject<Todo[]>;

  beforeEach(async () => {
    todosSubject = new Subject<Todo[]>();

    const spy = jasmine.createSpyObj('TodoService', [
      'loadAllTodos',
      'addTodo',
      'toggleTodoStatus',
      'deleteTodo'
    ], {
      todos$: todosSubject.asObservable()
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

  it('deve propagar itens do todos$ para o TodoList (integração)', fakeAsync(() => {
    todoServiceSpy.loadAllTodos.and.returnValue(of([]));
    fixture.detectChanges();

    const listDe = fixture.debugElement.query(By.directive(TodoListComponent));
    const listCmp = listDe.componentInstance as TodoListComponent;

    const mockTodos: Todo[] = [
      { id: 1, title: 'A', completed: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 2, title: 'B', completed: true, created_at: '2024-01-02', updated_at: '2024-01-02' }
    ];

    todosSubject.next(mockTodos);
    fixture.detectChanges();
    tick();

    expect(listCmp.todos).toEqual(mockTodos);
    // limpa o timer agendado pelo announceStatus do loadTodos
    tick(300);
  }));

  it('fluxo integração: adicionar tarefa via app-todo-form dispara serviço e mensagem de sucesso', fakeAsync(() => {
    todoServiceSpy.loadAllTodos.and.returnValue(of([]));
    todoServiceSpy.addTodo.and.returnValue(of({} as any));
    fixture.detectChanges();

    const formDe = fixture.debugElement.query(By.css('app-todo-form'));
    formDe.triggerEventHandler('addTodo', { title: 'Nova tarefa' });

    fixture.detectChanges();
    tick();

    expect(todoServiceSpy.addTodo).toHaveBeenCalledWith({ title: 'Nova tarefa' });

    const statusEl: HTMLElement | null = fixture.nativeElement.querySelector('#status-messages');
    expect(statusEl?.textContent).toContain('adicionada com sucesso');

    tick(300);
    fixture.detectChanges();
    expect(statusEl?.textContent).toBe('');
  }));

  it('fluxo integração: alternar status via app-todo-list dispara serviço e mensagem adequada', fakeAsync(() => {
    todoServiceSpy.loadAllTodos.and.returnValue(of([]));
    todoServiceSpy.toggleTodoStatus.and.returnValue(of({} as any));
    fixture.detectChanges();

    const listDe = fixture.debugElement.query(By.css('app-todo-list'));
    listDe.triggerEventHandler('toggleStatus', { id: 1, completed: true });

    fixture.detectChanges();
    tick();

    expect(todoServiceSpy.toggleTodoStatus).toHaveBeenCalledWith(1, true);

    const statusEl: HTMLElement | null = fixture.nativeElement.querySelector('#status-messages');
    expect(statusEl?.textContent).toContain('Tarefa concluída');
    // limpa o timer do announceStatus inicial
    tick(300);
  }));

  it('fluxo integração: remover via app-todo-list dispara serviço e mensagem de sucesso', fakeAsync(() => {
    todoServiceSpy.loadAllTodos.and.returnValue(of([]));
    todoServiceSpy.deleteTodo.and.returnValue(of({} as any));
    fixture.detectChanges();

    const listDe = fixture.debugElement.query(By.css('app-todo-list'));
    listDe.triggerEventHandler('remove', 123);

    fixture.detectChanges();
    tick();

    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(123);

    const statusEl: HTMLElement | null = fixture.nativeElement.querySelector('#status-messages');
    expect(statusEl?.textContent).toContain('Tarefa removida com sucesso');
    // limpa o timer do announceStatus inicial
    tick(300);
  }));
});


