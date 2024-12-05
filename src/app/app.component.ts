import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userRole: 'alumno' | 'profesor' | 'desconocido' = 'desconocido';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Observa el rol del usuario en tiempo real
    this.authService.userRole$.subscribe(role => {
      console.log("Rol del usuario:", role);
      this.userRole = role;
    });

    // Si hay un usuario autenticado, establece su rol al iniciar la app
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log('Usuario autenticado:', user);
        this.authService.setUserRole(user.email!); // Establece el rol en el AuthService
      } else {
        console.log('No hay usuario autenticado');
        this.userRole = 'desconocido';
      }
    });
  }

  logoutUser() {
    this.authService.logout().then(() => {
      console.log('Sesión cerrada');
      this.userRole = 'desconocido'; // Restablece el rol en el logout
      this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
    });
  }
}
