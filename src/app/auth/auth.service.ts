import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl: string = "https://identitytoolkit.googleapis.com/v1";
  signUpPath: string = "accounts:signUp";
  signInPath: string = "accounts:signInWithPassword";
  apiKey: string = "AIzaSyDj7GIOaW2cuElrkgoIlm-5-jCPuVV8uWw";
  userBehaviorSubject = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string): Observable<AuthResponse> { return this.sendAuthRequest(this.signUpPath, { email, password }); }

  login(email: string, password: string): Observable<AuthResponse> { return this.sendAuthRequest(this.signInPath, { email, password }); }

  autoLogin(): void {
    const userData: { id: string, email: string, _token: string, _expiresAt: string} = JSON.parse(localStorage.getItem("userData"));
    if(!userData) return;
    const { id, email, _token, _expiresAt } = userData;
    const user = new User(id, email, _token, new Date(_expiresAt));
    if(user.token) {
      this.userBehaviorSubject.next(user);
      this.autoLogout(new Date(_expiresAt).getTime() - new Date().getTime());
    }
  }

  logout(): void { 
    this.userBehaviorSubject.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    if(this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expiresIn: number): void { this.tokenExpirationTimer = setTimeout(() => this.logout(), expiresIn); }

  private sendAuthRequest(path: string, credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/${path}?key=${this.apiKey}`, { ...credentials, returnSecureToken: true })
    .pipe(catchError(this.handleError), tap(((response: AuthResponse) => this.handleAuthentication(response))));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error occurred!";
    if(!errorResponse?.error?.error) return throwError(errorMessage);
    switch(errorResponse.error.error.message) {
      case "EMAIL_EXISTS": errorMessage = "This email already exists!"; break;
      case "OPERATION_NOT_ALLOWED": errorMessage = "Operation not allowed!"; break;
      case "TOO_MANY_ATTEMPTS_TRY_LATER": errorMessage = "Too many attempts! Try later!"; break;
      case "EMAIL_NOT_FOUND": errorMessage = "This email address does not exist!"; break;
      case "INVALID_PASSWORD": errorMessage = "This password is not correct!"; break;
      case "USER_DISABLED": errorMessage = "User is disabled!"; break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(response: AuthResponse): void {
    const { localId, email, idToken, expiresIn } = response;
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + +expiresIn * 1000);
    const user = new User(localId, email, idToken, expiresAt);
    this.userBehaviorSubject.next(user);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user))
  }
}
