import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface ClassData {
  className: string;
  classCode: string;
  classDate: Date;
  professorName?: string;
}

@Component({
  selector: 'app-register-attendance',
  templateUrl: './register-attendance.page.html',
  styleUrls: ['./register-attendance.page.scss'],
})
export class RegisterAttendancePage implements OnInit {
  accessCode: string = ''; // Código de acceso ingresado manualmente
  currentUser: any = null;
  scannerResult: string | null = null; // Resultado del escaneo de QR

  @ViewChild('reader', { static: false }) readerElem!: ElementRef; // Referencia al contenedor del escáner

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
      if (user) {
        console.log('Usuario autenticado:', user);
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  // Método para registrar asistencia mediante el código de acceso
  async registerAttendance() {
    const codeToUse = this.scannerResult || this.accessCode;
    if (!codeToUse) {
      this.showAlert('Error', 'Por favor, ingrese o escanee el código de acceso.');
      return;
    }

    const classDoc = await this.firestore.collection('classes', ref => ref.where('accessCode', '==', codeToUse)).get().toPromise();
  
    if (classDoc && !classDoc.empty) {
      const classData = classDoc.docs[0].data() as ClassData;
      const studentName = this.currentUser?.displayName || this.currentUser?.email || 'Nombre no disponible';
      const studentEmail = this.currentUser?.email || 'Email no disponible';
      const professorName = classData.professorName || 'No disponible';

      await this.firestore.collection('attendance').add({
        classId: classDoc.docs[0].id,
        studentName,
        studentEmail,
        professorName,
        className: classData.className,
        classCode: classData.classCode,
        classDate: classData.classDate,
        attendanceDate: new Date(),
      });

      this.showAlert('Éxito', 'Asistencia registrada correctamente.');
      this.scannerResult = null; // Restablece el resultado del escaneo después de registrar la asistencia
    } else {
      this.showAlert('Error', 'Código de clase no válido.');
    }
  }

  // Solicita permisos de cámara y, si son otorgados, inicia el escaneo de QR
  async startQrScan() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        this.initHtml5QrcodeScanner(); // Llama al método para iniciar el escaneo si se concede el permiso
      }
    } catch (error) {
      this.showAlert('Permiso denegado', 'Por favor, permita el uso de la cámara en la configuración.');
      console.error('Error al solicitar permisos de cámara:', error);
    }
  }

  // Método para inicializar Html5QrcodeScanner
  private initHtml5QrcodeScanner() {
    const html5QrCode = new Html5QrcodeScanner(
      this.readerElem.nativeElement.id,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      /* verbose= */ false
    );

    html5QrCode.render(
      (decodedText) => {
        this.scannerResult = decodedText;
        html5QrCode.clear(); // Detiene el escaneo una vez que obtenemos un resultado
        this.registerAttendance(); // Registrar la asistencia automáticamente
      },
      (errorMessage) => {
        console.error(`Error al escanear: ${errorMessage}`);
      }
    );
  }

  // Mostrar alerta de éxito o error
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
