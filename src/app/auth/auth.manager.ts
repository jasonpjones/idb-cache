import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthManager {

  private jwt = new JwtHelperService();
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdnIiOiIobG9jYWwpIiwiZGIiOiJWMjFfMSIsInVuIjoiampvbmVzIiwiaWQiOiJkZGJhNjhmNS01ZDQ2LTQ1ZTktODU0Ny01MzJhYjU4NTgxZDUiLCJpYXQiOiIyMDE5LTAyLTExVDE3OjMzOjE4LjQ1ODA2MDFaIn0.tIbgxGYMjkFErGkO9qGRItEONYjM3MsGly9dHrayc7c';

  constructor(private http: HttpClient) {
  }

  getServer(): string {
    return 'http://localhost/act.web.api/';
  }

  setServer(server): void {

  }

  getToken(): string {
    return this.token;
  }

  clear(): void {
    this.token = null;

  }


  setToken(token: string) {
    this.token = token;
  }

  getDecodedToken(): any {
    return this.jwt.decodeToken(this.getToken());
  }

  tokenExpired(): boolean {
    const expires = false;
    const token = this.getDecodedToken();
    const now: any = new Date().getTime();
    if (token && token.iat) {
      const expiresWhen: any = new Date(token.iat).getTime() + 3600000;
      const expiresIn = expiresWhen - now;
      return expiresIn < 1;
    }
    return expires;
  }
  setRequestHeaders(toClone?: HttpRequest<any>): HttpRequest<any> {
    return toClone.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
  }


  refreshToken(): Observable<boolean> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http
      .get(this.getServer() + 'authorize', {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((res: string) => {
          this.setToken(res);
          return true;
        }),
        catchError(error => of(false)),
      );
  }

}
