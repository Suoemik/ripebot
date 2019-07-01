
//jshint esversion:6
import './firebase-app.js';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyArsEa2dDk3UO7grT7cHHKFh9hRF3mEWgM",
  authDomain: "ripe-2019.firebaseapp.com",
  databaseURL: "https://ripe-2019.firebaseio.com",
  projectId: "ripe-2019",
  storageBucket: "ripe-2019.appspot.com",
  messagingSenderId: "151655632550",
  appId: "1:151655632550:web:0151053bce277897"
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
