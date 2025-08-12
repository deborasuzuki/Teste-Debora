import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ApiResponse } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8001';
  
  private httpOptionsWithBody = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private httpOptionsWithoutBody = {};

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }
    
    console.error('Erro na API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, this.httpOptionsWithoutBody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, this.httpOptionsWithBody)
      .pipe(
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, this.httpOptionsWithBody)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, this.httpOptionsWithoutBody)
      .pipe(
        catchError(this.handleError)
      );
  }
}
