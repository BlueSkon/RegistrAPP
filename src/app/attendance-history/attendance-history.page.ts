import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

interface AttendanceRecord {
  className: string;
  classCode: string;
  classDate: Date;
  startTime: Date;
  professorName?: string;
}

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.page.html',
  styleUrls: ['./attendance-history.page.scss'],
})
export class AttendanceHistoryPage implements OnInit {
  attendanceRecords: AttendanceRecord[] = [];
  filteredAttendanceRecords: AttendanceRecord[] = [];
  currentUserEmail: string = '';
  filterClassName: string = '';
  filterDate: string = '';
  showDatePicker = false;
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.email) {
        this.currentUserEmail = user.email;
        this.loadAttendanceRecords();
      }
    });
  }

  loadAttendanceRecords() {
    this.firestore.collection('attendance', ref => ref.where('studentEmail', '==', this.currentUserEmail))
      .valueChanges()
      .subscribe((records: any) => {
        this.attendanceRecords = records.map((record: any) => {
          const classDate = record.classDate instanceof Date ? record.classDate : record.classDate?.toDate ? record.classDate.toDate() : new Date();
          const startTime = record.startTime instanceof Date ? record.startTime : record.startTime?.toDate ? record.startTime.toDate() : new Date();
          return {
            className: record.className,
            classCode: record.classCode,
            classDate: classDate,
            startTime: startTime,
            professorName: record.professorName || 'No disponible'
          };
        });
        this.applyFilters();
      });
  }

  // Método para aplicar filtros según el nombre y la fecha de la clase
  applyFilters() {
    this.filteredAttendanceRecords = this.attendanceRecords.filter(record => {
      const matchesName = this.filterClassName
        ? record.className.toLowerCase().includes(this.filterClassName.toLowerCase())
        : true;

      const matchesDate = this.filterDate
        ? new Date(record.classDate).toDateString() === new Date(this.filterDate).toDateString()
        : true;

      return matchesName && matchesDate;
    });
  }
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

}
