import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 401) {
            // Unauthorized - redirect to login
            this.authService.logout();
            this.router.navigate(['/login']);
            errorMessage = 'Your session has expired. Please login again.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to perform this action.';
          } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check your connection.';
          } else {
            errorMessage = error.error?.message || `Server error: ${error.status}`;
          }
        }

        console.error('API Error:', {
          status: (error as any)?.status,
          message: errorMessage,
          url: request.url,
          original: error
        });

        // Re-throw the original HttpErrorResponse so callers can inspect status and body
        return throwError(() => error);
      })
    );
  }
}
