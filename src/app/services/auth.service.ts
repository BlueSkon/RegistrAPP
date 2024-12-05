import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRoleSubject = new BehaviorSubject<'alumno' | 'profesor' | 'desconocido'>('desconocido');
  public userRole$: Observable<'alumno' | 'profesor' | 'desconocido'> = this.userRoleSubject.asObservable();

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.userRole$.subscribe(role => {
      console.log("Rol actualizado en userRole$: ", role);
    });
  }

  // Método para registrar un usuario y establecer el displayName
  register(email: string, password: string, fullName: string, rut: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user?.uid;
        
        // Guardar datos adicionales en Firestore
        return this.firestore.collection('users').doc(uid).set({
          uid: uid,
          fullName: fullName,
          rut: rut,
          email: email
        }).then(() => {
          // Actualizar displayName en Firebase Authentication
          return this.updateDisplayName(fullName);
        });
      });
  }

  // Método para iniciar sesión y sincronizar el rol y displayName
  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        // Establecer el rol del usuario
        this.setUserRole(user.email!);

        // Sincronizar displayName con Firestore
        this.setDisplayNameFromFirestore(user.uid);
      }
    });
  }

  // Cerrar sesión y restablecer el rol a "desconocido"
  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.userRoleSubject.next('desconocido');
    });
  }

  // Método para establecer el rol del usuario basado en el email
  public setUserRole(email: string): void {
    const role = this.getUserRole(email);
    this.userRoleSubject.next(role);
  }

  // Método para actualizar el displayName en Firebase Authentication
  private updateDisplayName(fullName: string): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      return user?.updateProfile({
        displayName: fullName
      }) ?? Promise.resolve();
    });
  }

  // Sincronizar displayName desde Firestore al iniciar sesión
  private setDisplayNameFromFirestore(userId: string): void {
    this.firestore.collection('users').doc(userId).valueChanges().subscribe((userData: any) => {
      if (userData && userData.fullName) {
        this.updateDisplayName(userData.fullName);
      }
    });
  }

  // Obtener el usuario actual con su rol como observable
  getCurrentUserWithRole(): Observable<{ user: firebase.User; role: 'alumno' | 'profesor' | 'desconocido' } | null> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          this.setUserRole(user.email!);
          return { user, role: this.userRoleSubject.value };
        }
        return null;
      })
    );
  }

  // Obtener el usuario actual como observable
  getCurrentUser(): Observable<firebase.User | null> {
    return from(this.afAuth.currentUser);
  }

  // Determina el rol del usuario basado en el dominio de su correo
  public getUserRole(email: string): 'alumno' | 'profesor' | 'desconocido' {
    if (email.endsWith('@duocuc.cl')) {
      return 'alumno';
    } else if (email.endsWith('@profesor.duoc.cl')) {
      return 'profesor';
    } else {
      return 'desconocido';
    }
  }
}
