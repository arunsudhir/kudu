import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';

// firebase
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithPopup, currentUser } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics';


//hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAszhzOya2A-jSMikmPo18nic3WXHpATIk",
  authDomain: "kudu-0203.firebaseapp.com",
  projectId: "kudu-0203",
  storageBucket: "kudu-0203.appspot.com",
  messagingSenderId: "806415926452",
  appId: "1:806415926452:web:0085ae22024438fd88c3e1",
  measurementId: "G-Y76MMVGZ6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const messagesRef = collection(db, 'messages');

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // User info
      const user = result.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    })
  }
  return (
    <button onClick={signInWithGoogle}>Sign In With Google </button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={ () => auth.signOut()}>Sign Out </button>
  )
}




const ChatRoom = () => {
  
  const [value, loading, error] = useCollectionData(
    messagesRef,
    orderBy('createdAt'),
    limit(25)
  );
  const [formValue, setFormValue ] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    console.log(auth.currentUser);
    const {uid, photoURL} = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
  })
  setFormValue('');
  
  }

  console.log(value);
  return (
    <>
      <main>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && 
            value.map((doc) => (
              <ChatMessage key={doc.id}
              message={doc} />
            ))
        }
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit" disabled={!formValue}>FLY </button>
      </form>
    </>
  );
};

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass= uid === auth.currentUser.uid ? 'sent' : 'received'
  return (
    <div className={`message ${messageClass}`}>
    <img src={photoURL} />  
    <p> {text}</p>
    </div>
  )
}
export default App;
