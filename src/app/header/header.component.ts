import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = true;
  isAuthenticated: boolean = false;
  userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void { this.userSubscription = this.authService.userBehaviorSubject.subscribe((user: User) => this.isAuthenticated = !!user); }

  ngOnDestroy(): void { this.userSubscription.unsubscribe(); }

  onLogout(): void { this.authService.logout(); }

  onSaveData(): void { this.dataStorageService.storeRecipes(); }

  onFetchData(): void { this.dataStorageService.fetchRecipes().subscribe(); }
}
