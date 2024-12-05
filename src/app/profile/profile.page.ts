import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

interface UserData {
  fullName: string;
  rut: string;
  email: string;
  photoURL?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userData: UserData | null = null;
  currentUser: firebase.User | null = null;
  fullName: string = ''; // Variable temporal para el nombre completo
  rut: string = ''; // Variable temporal para el RUT
  isEditing = false; // Controla el modo de edición
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        // Cargar los datos del usuario desde Firestore
        this.firestore.collection('users').doc<UserData>(user.uid).valueChanges().subscribe(data => {
          this.userData = data || null;
          if (data) {
            this.fullName = data.fullName;
            this.rut = data.rut;
          }
        });
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateUserData() {
    if (this.currentUser) {
      // Actualiza los datos en Firestore usando las variables temporales
      this.firestore.collection('users').doc(this.currentUser.uid).update({
        fullName: this.fullName,
        rut: this.rut
      }).then(() => {
        this.isEditing = false; // Salir del modo de edición después de guardar
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  logoutUser() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error("Error al cerrar sesión:", error);
    });
  }

  uploadPhoto() {
    if (this.currentUser && this.selectedFile) {
      const filePath = `user_photos/${this.currentUser.uid}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.userData!.photoURL = url;
            this.firestore.collection('users').doc(this.currentUser!.uid).update({
              photoURL: url
            });
          });
        })
      ).subscribe();
    }
  }
}
