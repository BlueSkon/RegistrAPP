import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera'; // Importa Camera para solicitar permisos
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userRole: 'alumno' | 'profesor' | 'desconocido' = 'desconocido';

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    // Solicita permisos al iniciar la aplicación
    await this.requestPermissions();

    // Observa el rol del usuario en tiempo real
    this.authService.userRole$.subscribe(role => {
      console.log('Rol del usuario:', role);
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

  async requestPermissions() {
    try {
      if (Capacitor.isNativePlatform()) {
        // Solicita permisos de cámara
        const permissions = await Camera.requestPermissions({ permissions: ['camera'] });
        if (permissions.camera !== 'granted') {
          console.warn('Permisos de cámara no otorgados');
        } else {
          console.log('Permisos de cámara otorgados');
        }
      } else {
        console.log('No se requieren permisos de cámara en el navegador.');
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }

  logoutUser() {
    this.authService.logout().then(() => {
      console.log('Sesión cerrada');
      this.userRole = 'desconocido'; // Restablece el rol en el logout
      this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
    });
  }
}