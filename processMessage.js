const API_AI_TOKEN = "4L7IL5ZCVETHWLHZAYM5QM5ODXW3PQRW";
const apiAiClient = API_AI_TOKEN;
const FACEBOOK_ACCESS_TOKEN = "EAAiBKzzP6RwBAGddy8vEovhklyPnUNFGv7JMh61JZA2lfxIbaeVpN0MmDZBQuwXSZBZBx3b82WXTcddDwgL1k4hnZBoYyWyIxOZAuWDjfljXGF1tkZBZCF6TdH2bbGNrYjAX0Arvp5d49FIrsmZA8CUnaYBG85ZAe0EPFREurqhOYqSiS0GdFhCCiLPwtcvTsZCgkMZD";
const request = require("request");
const {Wit, log} = require('node-wit');
const interactive = require('node-wit').interactive;
const firebase = require('firebase-admin');
const servacc = require('./ripe-website-firebase-adminsdk-jj6qe-a38bc3f7ca-2.json');

const fireapp = firebase.initializeApp({
  databaseURL: "https://ripe-website.firebaseio.com", // Realtime Database
  credential: firebase.credential.cert(servacc)
})

const db = firebase.database();
const dairydict = db.ref('Dairy');
var dairyvals = null;
const proddict = db.ref('Produce');
var prodvals = null;

dairydict.once("value").then(function(snapshot) {
  dairyvals = snapshot.val();
  // for(var d in dairyvals){
  //   console.log(d.toLowerCase().includes("milk"));
  // }
  console.log(dairyvals["Almond Milk"]);
});

proddict.once("value").then(function(snapshot) {
  prodvals = snapshot.val();
  console.log(prodvals["Fresh Kale"]);
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
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
};

const sendMessage = (senderId, msg) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: "POST",
    json: {
      recipient: { id: senderId },
      message: msg,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
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
      // console.log(entities);
      console.log(entities);
      // For now, let's reply with another automatic message
      if(entities.hasOwnProperty("greetings") && entities.greetings.length > 0){
        if(entities.greetings[0].value == "true"){
          console.log("Hi there! What grocery item would you like to know about?");
          sendTextMessage(senderId, "Hi there! What grocery item would you like to know about?");
        }
      }else if(entities.hasOwnProperty("food_type") && entities.food_type.length > 0){
        if(entities.food_type[0].value != ""){
          // sendTextMessage(senderId, "These are the results of your query: "+entities.food_type[0].value+".");

          dairydict.once("value").then(function(snapshot) {
            dairyvals = snapshot.val();
            var count = 0;
            for(var d in dairyvals){
              if(d.toLowerCase().includes(entities.food_type[0].value.toLowerCase())){
                console.log("These are the results of your query: "+entities.food_type[0].value);
                count++;
              }
            }
            console.log("Dairy count is: "+count);

            if(count > 0){

              console.log("Dairy count is greater than 0");
              var drop_msg = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "button",
                      "text":"Choose one",
                        "buttons": [{
                          "type": "postback",
                          "title": "Expiration",
                          "payload": "Exp"
                        }, {
                          "type": "postback",
                          "title": "Nutrition",
                          "payload": "Nut"
                        }, {
                          "type": "postback",
                          "title": "Deals",
                          "payload": "Deal"
                        }, {
                          "type": "postback",
                          "title": "Recipes/Cooking",
                          "payload": "Rec"
                        }]
                    }
                  }
                };
                // sendTextMessage(senderId, "These are the results of your query: "+dairyvals[d]+".");
                sendMessage(senderId, drop_msg);
            }
          });

          proddict.once("value").then(function(snapshot) {
            prodvals = snapshot.val();
            var count = 0;
            for(var p in prodvals){
              if(p.toLowerCase().includes(entities.food_type[0].value.toLowerCase())){
                console.log("These are the results of your query: "+entities.food_type[0].value);
                count++;
              }
            }
            console.log("Prod count is: "+count);

            if(count > 0){

              console.log("Prod count is greater than 0");
              var drop_msg = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "button",
                      "text":"Choose one",
                        "buttons": [{
                          "type": "postback",
                          "title": "Expiration",
                          "payload": "Exp"
                        }, {
                          "type": "postback",
                          "title": "Nutrition",
                          "payload": "Nut"
                        }, {
                          "type": "postback",
                          "title": "Deals",
                          "payload": "Deal"
                        }, {
                          "type": "postback",
                          "title": "Recipes/Cooking",
                          "payload": "Rec"
                        }]
                    }
                  }
              };
            // sendTextMessage(senderId, "These are the results of your query: "+prodvals[p]+".");
            sendMessage(senderId, drop_msg);
            }
          });
        }
      }else sendTextMessage(senderId, "Query not found in database");
    })
    .catch((err) => {
      console.error("Oops! Got an error from Wit: ", err.stack || err);
    })
  }
};
//interactive(wit);
