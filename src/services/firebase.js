import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

// Configuração do Firebase com valores padrão elegantes e suporte a variáveis de ambiente (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_MaryKaySystemProductionKey001",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vendas-marykay.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vendas-marykay",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vendas-marykay.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "88271639102",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:88271639102:web:9b08f4c9a721"
};

// Email do Administrador Supremo do Sistema
export const ADMIN_EMAIL = "elcortelini@gmail.com";

let app;
let auth;
let db;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  console.warn("Inicializando modo de compatibilidade/simulação Firebase:", e);
}

// 1. Login com Google
export const loginWithGoogle = async () => {
  if (!auth) {
    throw new Error("Serviço de autenticação não disponível.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erro ao realizar login pelo Google:", error);
    throw error;
  }
};

// 2. Logout
export const logoutUser = async () => {
  if (auth) {
    await signOut(auth);
  }
};

// 3. Monitor de Estado do Usuário
export const subscribeToAuth = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

// 4. Verificar se o usuário é Administrador Supremo
export const isUserAdmin = (user) => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export { app, auth, db };
