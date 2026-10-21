(function (global) {
  var firebaseConfig = {
    apiKey: 'AIzaSyBfWhx4Bvxjx3kFECDbBQtfM1RoVqQ8qfA',
    authDomain: 'p2p-ebook-empire.firebaseapp.com',
    projectId: 'p2p-ebook-empire',
    storageBucket: 'p2p-ebook-empire.firebasestorage.app',
    messagingSenderId: '570621574553',
    appId: '1:570621574553:web:8f4693194ce36a541aa708',
    measurementId: 'G-V6NEP2HN2R'
  };

  var configured = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY';
  var app = null;
  var auth = null;
  var db = null;

  if (configured && global.firebase && !global.firebase.apps.length) {
    app = global.firebase.initializeApp(firebaseConfig);
    auth = global.firebase.auth();
    db = global.firebase.firestore();
  } else if (configured && global.firebase && global.firebase.apps.length) {
    app = global.firebase.app();
    auth = global.firebase.auth();
    db = global.firebase.firestore();
  }

  global.BP2PFirebase = {
    configured: configured,
    app: app,
    auth: auth,
    db: db
  };
})(window);
