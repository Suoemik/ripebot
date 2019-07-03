
//jshint esversion:6
import './firebase-app.js';

// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAxYwEWt7ApF0h-3k42x7YPMW0iJLWYH6g",
    authDomain: "ripe-website.firebaseapp.com",
    databaseURL: "https://ripe-website.firebaseio.com",
    projectId: "ripe-website",
    storageBucket: "ripe-website.appspot.com",
    messagingSenderId: "1004358778912",
    appId: "1:1004358778912:web:fb9ddf8ab0757e22"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();
let prodfile = require('./data.json');
let dairyfile = require('./data.json');

let prodstr = JSON.stringify(prodfile);
let dairystr = JSON.stringify(dairyfile);


console.log(prodstr);
console.log(dairystr);
