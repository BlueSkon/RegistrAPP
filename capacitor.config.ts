import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', // Identificador único de la aplicación
  appName: 'RegistrAPP', // Nombre de la aplicación
  webDir: 'www', // Carpeta donde se construye el proyecto web
  bundledWebRuntime: false, // Usa false para no incluir el runtime de Capacitor

  // Configuración específica para plataformas nativas
  plugins: {
    CapacitorCamera: {
      // Configuración para el acceso a la cámara
      permissions: {
        camera: true, // Permite el acceso a la cámara
      },
    },
    CapacitorWebView: {
      // Permitir contenido mixto en el WebView
      allowMixedContent: true,
    },
  },

  // Configuración del servidor (útil para depuración en dispositivos reales)
  server: {
    cleartext: true, // Permitir tráfico HTTP en lugar de HTTPS (solo para pruebas)
    iosScheme: 'https', // Esquema para iOS
  },

  // Configuraciones adicionales para Android
  android: {
    webContentsDebuggingEnabled: true, // Habilitar depuración del contenido web
  },
};

export default config;
