import firebase from 'firebase/compat/app';
const config = require('../config/default.json')
    //firebaseSDK
const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
};

firebase.initializeApp(firebaseConfig)
export default firebase