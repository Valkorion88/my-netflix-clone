import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut} from "firebase/auth";
import { 
  addDoc, 
  collection, 
  getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCMl0-VErO_7aTMlwpilLicZzU0N8Jy2dc",
  authDomain: "netflix-clone-48eef.firebaseapp.com",
  projectId: "netflix-clone-48eef",
  storageBucket: "netflix-clone-48eef.firebasestorage.app",
  messagingSenderId: "490880841987",
  appId: "1:490880841987:web:86037ca8f22806f16b5136"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try{
    const res = await createUserWithEmailAndPassword(auth, email, password );
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  }catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const logout = () => {
  signOut(auth);
}

export {auth, db, login, signup, logout};