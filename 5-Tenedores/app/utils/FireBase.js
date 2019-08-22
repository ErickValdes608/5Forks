import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDFuDVGuf_QReVwGkB4dBDS7LQNAbWtXcc",
  authDomain: "tenedores-253c2.firebaseapp.com",
  databaseURL: "https://tenedores-253c2.firebaseio.com",
  projectId: "tenedores-253c2",
  storageBucket: "tenedores-253c2.appspot.com",
  messagingSenderId: "556810526085",
  appId: "1:556810526085:web:dbd986d0dd115cbc"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
