import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface ClassData {
  id?: string;
  className: string;
  classCode: string;
  classDate: string;
  startTime: string;
  endTime: string;
  qrCode?: string;
  accessCode?: string;
}

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.page.html',
  styleUrls: ['./generate-qr.page.scss'],
})
export class GenerateQrPage implements OnInit {
  classes: ClassData[] = [];
  userRole: 'alumno' | 'profesor' | 'desconocido' | null = null;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });

    this.firestore.collection('classes').snapshotChanges().subscribe(data => {
      this.classes = data.map(e => {
        const classData = e.payload.doc.data() as ClassData;
        return { id: e.payload.doc.id, ...classData };
      });
    });
  }

  async confirmDeleteClass(classId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta clase?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteClass(classId);
          },
        },
      ],
    });

    await alert.present();
  }

  private deleteClass(classId: string) {
    this.firestore.collection('classes').doc(classId).delete().then(() => {
      console.log('Clase eliminada exitosamente');
    }).catch(error => {
      console.error('Error al eliminar la clase:', error);
    });
  }

  generateQRCode(classId: string) {
    const accessCode = this.generateAccessCode();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${accessCode}`;

    this.firestore.collection('classes').doc(classId).update({
      accessCode: accessCode,
      qrCode: qrCodeUrl
    }).then(() => {
      console.log('Código QR y código de acceso generados exitosamente');
    }).catch(error => {
      console.error('Error al generar el código QR:', error);
    });
  }

  private generateAccessCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  editClass(classId: string) {
    this.router.navigate(['/edit-class', classId]);
  }

  logoutUser() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }
}
