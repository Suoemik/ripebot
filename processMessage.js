const API_AI_TOKEN = "4L7IL5ZCVETHWLHZAYM5QM5ODXW3PQRW";
const apiAiClient = API_AI_TOKEN;
const FACEBOOK_ACCESS_TOKEN = "EAAiBKzzP6RwBAGddy8vEovhklyPnUNFGv7JMh61JZA2lfxIbaeVpN0MmDZBQuwXSZBZBx3b82WXTcddDwgL1k4hnZBoYyWyIxOZAuWDjfljXGF1tkZBZCF6TdH2bbGNrYjAX0Arvp5d49FIrsmZA8CUnaYBG85ZAe0EPFREurqhOYqSiS0GdFhCCiLPwtcvTsZCgkMZD";
const request = require("request");
const {Wit, log} = require('node-wit');
const interactive = require('node-wit').interactive;
const firebase = require('firebase');

const fireapp = firebase.initializeApp({
  apiKey: "AIzaSyAxYwEWt7ApF0h-3k42x7YPMW0iJLWYH6g",                             // Auth / General Use
  authDomain: "ripe-website.firebaseapp.com",         // Auth with popup/redirect
  databaseURL: "https://ripe-website.firebaseio.com", // Realtime Database
  storageBucket: "ripe-website.appspot.com",          // Storage
  messagingSenderId: "1004358778912",                  // Cloud Messaging});
  appId: "1:1004358778912:web:fb9ddf8ab0757e22"
})

const wit = new Wit({
  accessToken: API_AI_TOKEN,
  logger: new log.Logger(log.INFO)
});
const sendTextMessage = (senderId, text) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: "POST",
    json: {
      recipient: { id: senderId },
      message: { text },
    }
  });
};
module.exports = (event) => {
  const senderId = event.sender.id;
  const message = event.message.text;

  if(message){
    console.log("SK: sender ID is "+senderId);

    wit.message(message).then(({entities}) => {
      // You can customize your response to these entities

      console.log("SK: sender ID is "+senderId);
      console.log(entities);
      console.log(entities.entities);
      // For now, let's reply with another automatic message
      if(entities["entities"]["greetings"].length > 0 && entities["entities"]["greetings"][0].value){
        console.log("Hi there! What grocery item would you like to know about?");
        sendTextMessage(senderId, "Hi there! What grocery item would you like to know about?");
      }
      sendTextMessage(senderId, "We've received your message: "+message+".");
    })
    .catch((err) => {
      console.error("Oops! Got an error from Wit: ", err.stack || err);
    })
  }
};
//interactive(wit);
