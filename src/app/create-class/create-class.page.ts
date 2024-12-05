import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.page.html',
  styleUrls: ['./create-class.page.scss'],
})
export class CreateClassPage implements OnInit {
  className: string = '';
  classCode: string = '';
  classDate: string = '';
  startTime: string = '';
  endTime: string = '';
  userRole: 'alumno' | 'profesor' | 'desconocido' | null = null;

  // Variables para controlar la visibilidad de los campos desplegables
  showDatePicker = false;
  showStartTimePicker = false;
  showEndTimePicker = false;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtén el rol de usuario al cargar la página
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });
  }

  handleClassDateChange(event: any) {
    this.classDate = event.detail.value || ''; // Actualiza la fecha de la clase
  }

  handleStartTimeChange(event: any) {
    this.startTime = event.detail.value || ''; // Actualiza la hora de inicio
  }

  handleEndTimeChange(event: any) {
    this.endTime = event.detail.value || ''; // Actualiza la hora de término
  }

  // Método para alternar la visibilidad de los campos desplegables
  toggleDatePicker(type: string) {
    if (type === 'date') {
      this.showDatePicker = !this.showDatePicker;
      this.showStartTimePicker = false;
      this.showEndTimePicker = false;
    } else if (type === 'startTime') {
      this.showStartTimePicker = !this.showStartTimePicker;
      this.showDatePicker = false;
      this.showEndTimePicker = false;
    } else if (type === 'endTime') {
      this.showEndTimePicker = !this.showEndTimePicker;
      this.showDatePicker = false;
      this.showStartTimePicker = false;
    }
  }

  saveClass() {
    const newClass = {
      className: this.className,
      classCode: this.classCode,
      classDate: this.classDate,
      startTime: this.startTime,
      endTime: this.endTime
    };

    this.firestore.collection('classes').add(newClass).then(() => {
      console.log('Clase guardada exitosamente');
      this.router.navigate(['/generate-qr']);
    }).catch(error => {
      console.error('Error al guardar la clase:', error);
    });
  }

  logoutUser() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }
}