import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isLoggedIn = false;
  username = 'Mohamed';

  // دالة logout وهمية
  logout() {
    this.isLoggedIn = false;
    alert('Logged out successfully!');
  }

  // دالة login وهمية لتجربة navbar
  loginMock() {
    this.isLoggedIn = true;
  }
}
