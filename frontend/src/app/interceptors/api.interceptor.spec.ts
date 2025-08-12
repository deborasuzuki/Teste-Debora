import { HttpClient, HttpErrorResponse, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { apiInterceptor } from './api.interceptor';
import { environment } from '../../environments/environment';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('api.interceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve prefixar URL relativa com BASE_URL do environment', () => {
    http.get('/api/tarefas').subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tarefas`);
    expect(req.request.url).toBe(`${environment.apiBaseUrl}/api/tarefas`);
    req.flush({});
  });

  it('não deve alterar URL absoluta', () => {
    const absoluteUrl = 'https://example.com/api/tarefas';
    http.get(absoluteUrl).subscribe();
    const req = httpMock.expectOne(absoluteUrl);
    expect(req.request.url).toBe(absoluteUrl);
    req.flush({});
  });

  it('deve setar Content-Type application/json quando existir body e header ausente', () => {
    http.post('/api/tarefas', { title: 'X' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tarefas`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });

  it('não deve sobrescrever Content-Type quando já enviado', () => {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    http.post('/api/tarefas', 'raw', { headers }).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tarefas`);
    expect(req.request.headers.get('Content-Type')).toBe('text/plain');
    req.flush({});
  });

  it('deve tratar erro e propagar mensagem formatada', (done) => {
    http.get('/api/tarefas').subscribe({
      next: () => done.fail('esperava erro'),
      error: (err: Error) => {
        expect(err).toBeTruthy();
        expect(err.message).toContain('Código: 500');
        done();
      },
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tarefas`);
    req.flush({ message: 'falha' }, { status: 500, statusText: 'Server Error' });
  });
});


