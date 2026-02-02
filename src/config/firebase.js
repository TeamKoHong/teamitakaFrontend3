// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase 설정 (환경 변수로 관리)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Firebase 초기화
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  if (process.env.NODE_ENV === 'development') {

  }
} catch (error) {

}

export { auth };
export default app;
