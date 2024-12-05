import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

interface UserData {
  fullName: string;
  rut: string;
  email: string;
  photoURL?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  currentUser: firebase.User | null = null;
  userData: UserData | null = null;
  userRole: 'alumno' | 'profesor' | 'desconocido' | null = null;
  currentTime: string = ''; 

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Observa el rol del usuario
    this.authService.userRole$.subscribe(role => {
      console.log("Rol actualizado en userRole$: ", role); 
      this.userRole = role; 
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    // Obtener el usuario autenticado
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadUserData(user.uid);
      } else {
        this.router.navigate(['/home']);
      }
    });

    // Actualizar la fecha y hora en tiempo real
    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
      this.cdr.detectChanges();
    }, 1000);
  }

  // Cargar los datos del usuario desde Firestore
  loadUserData(uid: string) {
    this.firestore.collection('users').doc<UserData>(uid).valueChanges().subscribe(data => {
      if (data) {
        this.userData = data;
        console.log("Datos del usuario en Dashboard: ", this.userData); 
        this.cdr.detectChanges();
      }
    });
  }

  logoutUser() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }
}
