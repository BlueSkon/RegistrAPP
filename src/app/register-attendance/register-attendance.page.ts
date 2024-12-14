import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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
    this.afAuth.authState.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        console.log('Usuario autenticado:', user);
      } else {
        console.log('No hay usuario autenticado');
      }
    });

    // Solicitar permisos al inicializar la página
    this.requestPermissions();
  }

  // Solicita permisos de cámara globalmente al inicializar la página
  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Camera.requestPermissions({ permissions: ['camera'] });
        if (permissions.camera === 'granted') {
          console.log('Permisos de cámara otorgados.');
        } else {
          console.warn('Permisos de cámara no otorgados.');
          this.showAlert(
            'Permisos Requeridos',
            'Debe otorgar permisos de cámara para escanear códigos QR.'
          );
        }
      } catch (error) {
        console.error('Error al solicitar permisos de cámara:', error);
      }
    }
  }

  // Método para registrar asistencia mediante el código de acceso
  async registerAttendance() {
    const codeToUse = this.scannerResult || this.accessCode;
    if (!codeToUse) {
      this.showAlert('Error', 'Por favor, ingrese o escanee el código de acceso.');
      return;
    }

    const classDoc = await this.firestore
      .collection('classes', (ref) => ref.where('accessCode', '==', codeToUse))
      .get()
      .toPromise();

    if (classDoc && !classDoc.empty) {
      const classData = classDoc.docs[0].data() as ClassData;
      const studentName =
        this.currentUser?.displayName || this.currentUser?.email || 'Nombre no disponible';
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
      if (Capacitor.isNativePlatform()) {
        // Usa la cámara de Capacitor en dispositivos nativos
        const permissions = await Camera.requestPermissions({ permissions: ['camera'] });
        if (permissions.camera === 'granted') {
          console.log('Permisos otorgados. Inicializando escáner...');
          this.initHtml5QrcodeScanner(); // Inicializa el escáner
        } else {
          this.showAlert(
            'Permiso denegado',
            'Por favor, otorgue permisos de cámara en la configuración.'
          );
        }
      } else {
        // Usa Html5Qrcode en el navegador
        console.log('Ejecutando en un navegador. Usando Html5Qrcode.');
        this.initHtml5QrcodeScanner();
      }
    } catch (error) {
      console.error('Error al iniciar el escaneo:', error);
      this.showAlert('Error', 'No se pudo acceder a la cámara.');
    }
  }

  private initHtml5QrcodeScanner() {
    const html5QrCode = new Html5QrcodeScanner(
      'reader', // ID del contenedor en el HTML
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false
    );

    html5QrCode.render(
      (decodedText) => {
        console.log('Código QR detectado:', decodedText);
        this.scannerResult = decodedText;
        html5QrCode.clear(); // Detiene el escáner
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
