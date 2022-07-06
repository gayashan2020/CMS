import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { $Message } from "../components/antd";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_cmLmMV4aCGyGN1vK2hEouoYOzqE3f2Y",
  authDomain: "medicallms.firebaseapp.com",
  projectId: "medicallms",
  storageBucket: "medicallms.appspot.com",
  messagingSenderId: "220410726604",
  appId: "1:220410726604:web:7e0f055f31d1fec7059a69",
  measurementId: "G-1XSVWL48EV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    $Message.error(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    let data = await signInWithEmailAndPassword(auth, email, password);
    return data;
  } catch (err) {
    console.error(err);
    $Message.error("Wrong User name or Password");
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    $Message.error(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    $Message.error(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const storage = getStorage();

export {
  auth,
  db,
  storage,
  ref,
  uploadBytes,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
