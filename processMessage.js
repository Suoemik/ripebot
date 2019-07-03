const API_AI_TOKEN = "4L7IL5ZCVETHWLHZAYM5QM5ODXW3PQRW";
const apiAiClient = API_AI_TOKEN;
const FACEBOOK_ACCESS_TOKEN = "EAAiBKzzP6RwBAGddy8vEovhklyPnUNFGv7JMh61JZA2lfxIbaeVpN0MmDZBQuwXSZBZBx3b82WXTcddDwgL1k4hnZBoYyWyIxOZAuWDjfljXGF1tkZBZCF6TdH2bbGNrYjAX0Arvp5d49FIrsmZA8CUnaYBG85ZAe0EPFREurqhOYqSiS0GdFhCCiLPwtcvTsZCgkMZD";
const request = require("request");
const {Wit, log} = require('node-wit');
const interactive = require('node-wit').interactive;
const firebase = require('firebase');

const fireapp = firebase.initializeApp({
  apiKey: "AIzaSyArsEa2dDk3UO7grT7cHHKFh9hRF3mEWgM",                             // Auth / General Use
  authDomain: "ripe-2019.firebaseapp.com",         // Auth with popup/redirect
  databaseURL: "https://ripe-2019.firebaseio.com", // Realtime Database
});

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
      // For now, let's reply with another automatic message
      sendTextMessage(senderId, "We've received your message: "+message+".");
    })
    .catch((err) => {
      console.error("Oops! Got an error from Wit: ", err.stack || err);
    })
  }
};
// interactive(wit);
