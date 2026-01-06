import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDmF4gu602nfOazjim7105BAAcc5f5HgoI",
    authDomain: "antigravitywealth.firebaseapp.com",
    projectId: "antigravitywealth",
    storageBucket: "antigravitywealth.firebasestorage.app",
    messagingSenderId: "881298435552",
    appId: "1:881298435552:web:886621b3532711f9478f85",
    measurementId: "G-P8PVXECKWQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
