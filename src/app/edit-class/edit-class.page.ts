// edit-class.page.ts

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

interface ClassData {
  id?: string;
  className: string;
  classCode: string;
  classDate: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.page.html',
  styleUrls: ['./edit-class.page.scss'],
})
export class EditClassPage implements OnInit {
  classId: string | null = null;
  classData: ClassData = {
    className: '',
    classCode: '',
    classDate: '',
    startTime: '',
    endTime: ''
  };

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId) {
      this.loadClassData(this.classId);
    }
  }

  loadClassData(classId: string) {
    this.firestore.collection('classes').doc<ClassData>(classId).valueChanges().subscribe(data => {
      if (data) {
        this.classData = data;
      }
    });
  }

  updateClassData() {
    if (this.classId) {
      this.firestore.collection('classes').doc(this.classId).update(this.classData)
        .then(() => {
          console.log('Clase actualizada exitosamente');
          this.router.navigate(['/generate-qr']); // Redirige a la lista de clases después de actualizar
        })
        .catch(error => {
          console.error('Error al actualizar la clase:', error);
        });
    }
  }
}
