import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import {AuthManager} from "../../auth/auth.manager";
//import { ActBaseUrls } from '../../core/api/uri/base-urls';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authManager: AuthManager) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.match(new RegExp('authorize')) ||
      !request.url.match(new RegExp(this.authManager.getServer()))) {
      return next.handle(request);
    }

    let authRequest = this.authManager.setRequestHeaders(request);
    return next.handle(authRequest)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !error.url.match(new RegExp('authorize'))) {
            return this.authManager.refreshToken()
              .pipe(
                switchMap(() => {
                  authRequest = this.authManager.setRequestHeaders(request);
                  return next.handle(authRequest);
                }),
              );
          }
          return throwError(error);
        }),
      );
  }
}

