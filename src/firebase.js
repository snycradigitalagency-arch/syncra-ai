import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfSEgulQrrzwhfNFHSIegW1lCAf9tqQik",
  authDomain: "syncra-ai-6b4dd.firebaseapp.com",
  projectId: "syncra-ai-6b4dd",
  storageBucket: "syncra-ai-6b4dd.firebasestorage.app",
  messagingSenderId: "572449909275",
  appId: "1:572449909275:web:e8b8f0b4adc945c33e26be",
  measurementId: "G-BQMG6S7F7N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
