import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para navegación
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginUser() {
    this.authService.login(this.email, this.password)
      .then(res => {
        // Redirigir a la página 'dashboard' después del login exitoso
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        this.errorMessage = 'Error al iniciar sesión: ' + err.message;
      });
  }

  goToRegisterPage() {
    this.router.navigate(['/register']); // Navega a la página de registro
  }
}
