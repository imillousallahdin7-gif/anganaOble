import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfigJson from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || "AIzaSyC9ocROMUMbLfz-bU0ZhhR7-WSJzu2rpr0",
  authDomain: firebaseConfigJson.authDomain || "project-14720b5d-48da-442a-b1c.firebaseapp.com",
  projectId: firebaseConfigJson.projectId || "project-14720b5d-48da-442a-b1c",
  storageBucket: firebaseConfigJson.storageBucket || "project-14720b5d-48da-442a-b1c.firebasestorage.app",
  messagingSenderId: firebaseConfigJson.messagingSenderId || "563992701301",
  appId: firebaseConfigJson.appId || "1:563992701301:web:bda5eb7ddd4ddbec838b3c"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfigJson.firestoreDatabaseId || "ai-studio-arganobleauthent-0defc501-c35f-489a-8980-cd9eb32361d8"
);

export const auth = getAuth(app);
export const storage = getStorage(app);

