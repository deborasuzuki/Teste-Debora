import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { By } from '@angular/platform-browser';

describe('TodoFormComponent', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve desabilitar botão quando título vazio/whitespace', () => {
    component.form.get('title')?.setValue('   ');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('não deve emitir quando título vazio', () => {
    spyOn(component.addTodo, 'emit');
    component.form.get('title')?.setValue('   ');
    component.onSubmit();
    expect(component.addTodo.emit).not.toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
  });

  it('deve emitir addTodo e resetar formulário quando título válido', () => {
    spyOn(component.addTodo, 'emit');
    component.form.get('title')?.setValue('Nova tarefa');
    component.onSubmit();
    expect(component.addTodo.emit).toHaveBeenCalledWith({ title: 'Nova tarefa' });
    expect(component.form.get('title')?.value).toBe('');
    expect(component.isSubmitting).toBeFalse();
  });
});


