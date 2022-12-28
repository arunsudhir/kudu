import logo from './logo.svg';
import './css/upload.css';
import React, {useState} from 'react';

// firebase
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithPopup, currentUser } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics';
import { getStorage, ref } from "firebase/storage";


//hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';

//components
import PhotoUploader from './components/PhotoUploader';

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

// Conditional compilation
const debug = true;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
// Create a root reference for storage
const storage = getStorage();
const messagesRef = collection(db, 'messages');
let queryLastMessages = query(messagesRef, orderBy('createdAt', 'desc'), limit(25));

function App() {
  const [user] = useAuthState(auth)
  //const [photos, setPhotos] = useState([]);

  /*useEffect(() => {
    // Fetch the photos from the Google Photos API or some other source
    const fetchPhotos = async () => {
      const response = await fetch('https://photos.googleapis.com/v1/photos');
      const data = await response.json();
      setPhotos(data.photos);
    };

    fetchPhotos();
  }, []);
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
  return (
    <div className="app">
      <h1>My Photos</h1>
      <PhotoGrid photos={photos} />
    </div>
  );*/
  return (
    <div className="app">
      <h1>My Photos</h1>
      {user? <PhotoUploader storage={storage}/>  : <SignIn/> }
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


const ChatMessages = () => {
  const [value, loading, error] = useCollectionData(
    queryLastMessages,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  console.log(value);
  return (
    <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading Messages...</span>}
        {value && (
          <span>
            {value.reverse().map((doc) => (
              <ChatMessage key={doc.id}
              message={doc} />
            ))}
          </span>
        )}
    </div>
  );
};

const ChatRoom = () => {
  
  const [formValue, setFormValue ] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
  })
  setFormValue('');
  }

  return (
    <>
      <main>
        <ChatMessages />
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
