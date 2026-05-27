// 1. Importamos las funciones necesarias (añadimos Auth y Firestore)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 2. Tus datos reales de conexión
const firebaseConfig = {
  apiKey: 'AIzaSyBH8L2iDou4NOx3FLbR9x45Dnl_1mhldig',
  authDomain: 'staff-backend-32016.firebaseapp.com',
  projectId: 'staff-backend-32016',
  storageBucket: 'staff-backend-32016.firebasestorage.app',
  messagingSenderId: '765757876163',
  appId: '1:765757876163:web:5fafb99d743b352b02ff76',
};

// 3. Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// 4. ¡ESTO ES LO NUEVO! Activamos las herramientas y las exportamos para poder usarlas en la app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
