
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);

export async function register(email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function loginUser(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function isEmailInUse(email) {
  const methods = await fetchSignInMethodsForEmail(auth, email);
  return methods.length > 0;
}

export async function createDocument(collectionName, data) {
  const docRef = await addDoc(collection(database, collectionName), data);
  return docRef.id;
}

export async function setDocument(collectionName, docId, data) {
  await setDoc(doc(database, collectionName, docId), data);
  return docId;
}

export async function getDocument(collectionName, docId) {
  const snap = await getDoc(doc(database, collectionName, docId));
  return snap.exists() ? snap.data() : null;
}

export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(database, collectionName, docId));
}