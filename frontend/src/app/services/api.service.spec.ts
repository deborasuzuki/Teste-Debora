import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8001';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve fazer GET com baseUrl e opções sem body', () => {
    service.get('/api/tarefas').subscribe();
    const req = httpMock.expectOne(`${baseUrl}/api/tarefas`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBeNull();
    req.flush({});
  });

  it('deve aplicar retry(1) no GET e ainda assim propagar erro (ErrorEvent)', (done) => {
    service.get('/api/tarefas').subscribe({
      next: () => done.fail('deveria falhar'),
      error: (err) => {
        expect(err).toEqual(jasmine.any(Error));
        // handleError para ErrorEvent prefixa mensagem com "Erro:"
        expect(err.message).toContain('Erro:');
        done();
      }
    });

    const first = httpMock.expectOne(`${baseUrl}/api/tarefas`);
    first.error(new ErrorEvent('NetworkError'));

    const second = httpMock.expectOne(`${baseUrl}/api/tarefas`);
    second.error(new ErrorEvent('NetworkError'));
  });

  it('deve fazer POST com cabeçalho JSON e body', () => {
    const payload = { title: 'Nova' };
    service.post('/api/tarefas', payload).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/api/tarefas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('deve fazer PUT com cabeçalho JSON e body', () => {
    const payload = { completed: true };
    service.put('/api/tarefas/1', payload).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/api/tarefas/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('deve fazer DELETE com baseUrl', () => {
    service.delete('/api/tarefas/1').subscribe();
    const req = httpMock.expectOne(`${baseUrl}/api/tarefas/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('deve formatar erro HTTP (não ErrorEvent) com código e mensagem', (done) => {
    service.post('/api/tarefas', { a: 1 }).subscribe({
      next: () => done.fail('deveria falhar'),
      error: (err) => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toContain('Código: 500');
        expect(err.message).toContain('Mensagem:');
        done();
      }
    });
    const req = httpMock.expectOne(`${baseUrl}/api/tarefas`);
    req.flush({ message: 'Falhou' }, { status: 500, statusText: 'Server Error' });
  });
});


