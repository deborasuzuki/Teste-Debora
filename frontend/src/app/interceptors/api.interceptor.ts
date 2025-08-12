import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isRelativeUrl = req.url.startsWith('/');
  const url = isRelativeUrl ? `${BASE_URL}${req.url}` : req.url;

  const shouldSetJsonContentType = !!req.body && !req.headers.has('Content-Type');
  const headers = shouldSetJsonContentType
    ? req.headers.set('Content-Type', 'application/json')
    : req.headers;

  const clonedRequest = req.clone({ url, headers });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
      }

      // Centraliza o log de erros da API
      console.error('Erro na API:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};


