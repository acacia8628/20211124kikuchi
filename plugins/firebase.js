import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyB3QFYrpMVDVHE25TkU3VRYaxUQMoPH0u8",
      authDomain: "snspj-82180.firebaseapp.com",
      projectId: "snspj-82180",
      storageBucket: "snspj-82180.appspot.com",
      messagingSenderId: "439725213493",
      appId: "1:439725213493:web:5f4f413f9af6d526986e7c",
      measurementId: "G-VZ7NDG0B6B"
    }
  )
}

export default firebase