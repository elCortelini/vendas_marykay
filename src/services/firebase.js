import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore 
} from 'firebase/firestore';

// Configuração do Firebase com suporte a variáveis de ambiente (.env)
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

// 1. Autenticação com Google com fallback seguro
export const loginWithGoogle = async () => {
  if (auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) return result.user;
    } catch (error) {
      console.warn("Popup do Google indisponível ou bloqueado. Retornando controle ao modal:", error);
    }
  }
  return null;
};

// 1b. Autenticação por E-mail do Google
export const loginWithGoogleEmail = (emailInput) => {
  const email = emailInput?.trim().toLowerCase();
  if (!email) return null;

  if (email === ADMIN_EMAIL.toLowerCase()) {
    return loginAsAdminDirectly();
  }

  if (email === "tailiseroza@gmail.com") {
    return loginAsConsultantDirectly();
  }

  const nameFromEmail = email.split('@')[0];
  const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

  const user = {
    email: email,
    displayName: formattedName,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameFromEmail)}`
  };

  localStorage.setItem('mk_auth_user', JSON.stringify(user));
  return user;
};

// 1c. Login do Administrador Master
export const loginAsAdminDirectly = () => {
  const adminUser = {
    email: ADMIN_EMAIL,
    displayName: "elCortelini (Administrador Master)",
    photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=elcortelini"
  };
  localStorage.setItem('mk_auth_user', JSON.stringify(adminUser));
  return adminUser;
};

// 1d. Login da Consultora Tailise (tailiseroza@gmail.com)
export const loginAsConsultantDirectly = () => {
  const consultantUser = {
    email: "tailiseroza@gmail.com",
    displayName: "Tailise (Consultora)",
    photoURL: "/images/tailise_avatar.png"
  };
  localStorage.setItem('mk_auth_user', JSON.stringify(consultantUser));
  return consultantUser;
};

// 2. Logout
export const logoutUser = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {}
  }
  localStorage.removeItem('mk_auth_user');
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
