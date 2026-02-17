import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {
  username :string | null = null;
  constructor(public authService :Auth, private router : Router) {}
  ngOnInit(): void {
    this.authService.user$.subscribe(user => this.username = user?.username || null);
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
