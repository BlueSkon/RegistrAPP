import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

interface AttendanceRecord {
  studentName: string;
  studentEmail: string;
  attendanceDate: Date;
  className: string;
  classCode: string;
}

@Component({
  selector: 'app-class-attendance',
  templateUrl: './class-attendance.page.html',
  styleUrls: ['./class-attendance.page.scss'],
})
export class ClassAttendancePage implements OnInit {
  attendanceByClass: { [key: string]: AttendanceRecord[] } = {}; // Agrupado por nombre y código de clase

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  ngOnInit() {
    this.loadClassAttendance();
  }

  // Cargar todos los registros de asistencia sin filtros de usuario
  loadClassAttendance() {
    this.firestore.collection('attendance').valueChanges().subscribe((records: any) => {
      this.attendanceByClass = records.reduce((acc: { [key: string]: AttendanceRecord[] }, record: any) => {
        const attendanceDate = record.attendanceDate instanceof Date ? record.attendanceDate : record.attendanceDate?.toDate();
        const className = record.className || 'Clase sin nombre';
        const classCode = record.classCode || 'Código desconocido';
        const classKey = `${className} ${classCode}`; // Clave única con nombre y código

        if (!acc[classKey]) {
          acc[classKey] = [];
        }

        acc[classKey].push({
          studentName: record.studentName,
          studentEmail: record.studentEmail,
          attendanceDate: attendanceDate || new Date(),
          className: className,
          classCode: classCode,
        });

        return acc;
      }, {});
    });
  }
}
