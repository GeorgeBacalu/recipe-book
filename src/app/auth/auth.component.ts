import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  authObservable: Observable<AuthResponse>;

  constructor(private authService: AuthService, private router: Router) { }

  onSwitchMode(): void { this.isLoginMode = !this.isLoginMode; }

  onSubmit(form: NgForm): void {
    if(form.invalid) return;
    const { email, password } = form.value;
    this.isLoading = true;
    if(this.isLoginMode) this.authObservable = this.authService.login(email, password);
    else this.authObservable = this.authService.signUp(email, password);
    this.authObservable.subscribe(
      (response: AuthResponse) => { this.isLoading = false; this.router.navigate(["/recipes"]) },
      (errorMessage: string) => { this.isLoading = false; this.error = errorMessage; });
    form.reset();
  }
}
