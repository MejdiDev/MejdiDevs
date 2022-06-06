import { initializeApp } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB_lqFZYCTIzDXJ97Ksj-cgUU5HpLTSzPQ",
    authDomain: "mejdidevs.firebaseapp.com",
    projectId: "mejdidevs",
    storageBucket: "mejdidevs.appspot.com",
    messagingSenderId: "576913020490",
    appId: "1:576913020490:web:a5b00d31396b2bc20df8b3",
    measurementId: "G-0WFW61ZTZQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);