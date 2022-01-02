import firebase from 'firebase/compat/app';
//firebaseSDK
const firebaseConfig = {
    apiKey: "AIzaSyCorHqO6JFfwjlSEhd_lvE8DYzV9NK3cHY",
    authDomain: "notehub-e5514.firebaseapp.com",
    projectId: "notehub-e5514",
    storageBucket: "notehub-e5514.appspot.com",
    messagingSenderId: "283179678310",
    appId: "1:283179678310:web:1032f77fc6eff48a644ba7"
  };

firebase.initializeApp(firebaseConfig)
export default firebase