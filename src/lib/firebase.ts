import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9ocROMUMbLfz-bU0ZhhR7-WSJzu2rpr0",
  authDomain: "project-14720b5d-48da-442a-b1c.firebaseapp.com",
  projectId: "project-14720b5d-48da-442a-b1c",
  storageBucket: "project-14720b5d-48da-442a-b1c.firebasestorage.app",
  messagingSenderId: "563992701301",
  appId: "1:563992701301:web:bda5eb7ddd4ddbec838b3c"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-arganobleauthent-0defc501-c35f-489a-8980-cd9eb32361d8");
