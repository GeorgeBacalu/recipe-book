import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // returning an observable from inside a subscription doesn't work => 2 observables should be pipped into a single one using the exhaustMap operator
    // take - takes one value from the observable and then it automatically unsubscribes 
    // exhaustMap - waits for the first observable to complete, it gives back the data from that observable as a parameter and it returns the second observable which replaces the previous one in the chain
    return this.authService.userBehaviorSubject.pipe(take(1), exhaustMap((user: User) => next.handle(!user ? request : request.clone({ params: new HttpParams().set("auth", user.token )}))));
  }
}
