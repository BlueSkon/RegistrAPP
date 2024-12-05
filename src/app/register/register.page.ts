import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  fullName: string = '';
  rut: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registerUser() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Llama al método register y pasa todos los datos necesarios
    this.authService.register(this.email, this.password, this.fullName, this.rut)
      .then(() => {
        // Navega a la página de inicio después del registro exitoso
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.errorMessage = 'Error al registrar usuario: ' + err.message;
      });
  }
}
