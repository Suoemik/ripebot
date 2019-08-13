/*jshint esversion: 6 */

const API_AI_TOKEN = "4L7IL5ZCVETHWLHZAYM5QM5ODXW3PQRW";
const apiAiClient = API_AI_TOKEN;
const FACEBOOK_ACCESS_TOKEN = "EAAiBKzzP6RwBAGddy8vEovhklyPnUNFGv7JMh61JZA2lfxIbaeVpN0MmDZBQuwXSZBZBx3b82WXTcddDwgL1k4hnZBoYyWyIxOZAuWDjfljXGF1tkZBZCF6TdH2bbGNrYjAX0Arvp5d49FIrsmZA8CUnaYBG85ZAe0EPFREurqhOYqSiS0GdFhCCiLPwtcvTsZCgkMZD";
const request = require("request");
const {Wit, log} = require('node-wit');
const interactive = require('node-wit').interactive;
const firebase = require('firebase-admin');
const servacc = require('./ripe-website-firebase-adminsdk-jj6qe-a38bc3f7ca-2.json');
const open = require('open');

const fireapp = firebase.initializeApp({
  databaseURL: "https://ripe-website.firebaseio.com", // Realtime Database
  credential: firebase.credential.cert(servacc)
});

const db = firebase.database();
const dairydict = db.ref('Dairy');
var dairyvals = null;
const proddict = db.ref('Produce');
var prodvals = null;

var wit_food = "";
var fire_food = "";
var fire_food_arr = [];
var fire_food_cnt = 0;

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

const sendQuickReply = (senderId, msg) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: "POST",
    json: {
      recipient: { id: senderId },
      messaging_type: "RESPONSE",
      message: msg,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
};

const sendMessage = (senderId, msg) => {
  request({
    url: "https://graph.facebook.com/v4.0/me/messages",
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
  const quick_res = event.message.quick_reply;
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
          sendMessage(senderId, {text: "Hi there! What grocery item would you like to know about?"});
        }
      }
      if(entities.hasOwnProperty("food_type") && entities.food_type.length > 0){
        if(entities.food_type[0].value != ""){
          // sendMessage(senderId, {text: "These are the results of your query: "+entities.food_type[0].value+"."});

          wit_food = entities.food_type[0].value;

          dairydict.once("value").then(function(snapshot) {
            dairyvals = snapshot.val();
            var dairy_elems = [];
            fire_food_cnt = 0;

            for(var d in dairyvals){
              if(d.toLowerCase().includes(entities.food_type[0].value.toLowerCase())){
                console.log("These are the results of your query: "+entities.food_type[0].value);
                let elem = {
                  "title": d,
                  "buttons": [
                   {
                     "title": "Go",
                     "type": "postback",
                     "payload": "Go_"+d
                   }
                 ]
                };
                console.log(elem);
                fire_food_arr.push(dairyvals[d]);
                dairy_elems.push(elem);
                fire_food_cnt++;
              }
            }
            console.log("Dairy count is: "+fire_food_cnt);
            console.log("Prod count is: "+dairy_elems.length);

            if(fire_food_cnt > 0){
              var list_msg = {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": dairy_elems
                  }
                }
              };

              console.log("Dairy count is greater than 0");
              console.log(list_msg);
              console.log(dairy_elems);

              // sendMessage(senderId,{text: "Choose one:"});
              sendMessage(senderId, list_msg);
            }
          });

          proddict.once("value").then(function(snapshot) {
            prodvals = snapshot.val();
            var prod_elems = [];
            fire_food_cnt = 0;
            for(var p in prodvals){
              if(p.toLowerCase().includes(entities.food_type[0].value.toLowerCase())){
                console.log("These are the results of your query: "+entities.food_type[0].value);
                let elem = {
                  "title": p,
                  "buttons": [
                   {
                     "title": "Go",
                     "type": "postback",
                     "payload": "Go_"+p
                   }
                 ]
                };
                console.log(elem);
                fire_food_arr.push(prodvals[p]);
                prod_elems.push(elem);
                fire_food_cnt++;
              }
            }
            console.log("Prod count is: "+fire_food_cnt);
            console.log("Prod count is: "+prod_elems.length);

            if(fire_food_cnt > 0){
              var list_msg = {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": prod_elems
                  }
                }
              };
              console.log("Prod count is greater than 0");
              console.log(list_msg);
              console.log(prod_elems);

              // sendMessage(senderId,{text: "Choose one:"});
              sendMessage(senderId, list_msg);
            }
          });
        }else sendMessage(senderId, {text: "Query not found in database"});

      }

      // if (entities.hasOwnProperty("dropdown_choice") && entities.dropdown_choice.length > 0) {
      //   if(entities.dropdown_choice[0].value != ""){
      //     if (entities.dropdown_choice[0].value === "Expiration") {
      //       sendMessage(senderId, {text: "Expiration Date"});
      //     } else if (entities.dropdown_choice[0].value === "Nutrition") {
      //       sendMessage(senderId, {text: "Nutrition Information"});
      //     } else if (entities.dropdown_choice[0].value === "Deals") {
      //       sendMessage(senderId, {text: "Deals"});
      //     } else if (entities.dropdown_choice[0].value === "Recipes") {
      //       console.log("Wit_food is "+wit_food);
      //       sendMessage(senderId, {text: ("Recipes for "+wit_food)});
      //     }
      //   }
      // }
    })
    .catch((err) => {
      console.error("Oops! Got an error from Wit: ", err.stack || err);
    });
  }
  if(quick_res){
    var quick_pay = quick_res.payload;

    if(quick_pay){
      fire_food = item = payload.split("_")[1];
      let fire_food_info = fire_food_arr.filter((el)=>{
        el["Item"] == fire_food;
      });
      var exp_msg = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "list",
            "top_element_style": "compact",
            "elements": [
              {
                "title": "Counter or Pantry",
                "subtitle": fire_food["Counter or Pantry"]
              },{
                "title": "Refrigerator",
                "subtitle": fire_food["Refrigerator"]
              },{
                "title": "Freezer",
                "subtitle": fire_food["Freezer"]
              },{
                "title": "Post Prinited Expiration date",
                "subtitle": fire_food["Post Prinited Expiration date"]
              }
            ]
          }
        }
      };

      if (quick_pay.includes("Exp")) {
        sendMessage(senderId, {text: "Expiration Information"});
        sendMessage(senderId, exp_msg);

      } else if (quick_pay.includes("Nut")) {
        sendMessage(senderId, {text: "Nutrition Information"});
      } else if (quick_pay.includes("Deal")) {
        sendMessage(senderId, {text: "Deals"});
      } else if (quick_pay.includes("Rec")) {
        var rec_msg = {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Would you like to",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.allrecipes.com/search/results/?wt="+fire_food+"&sort=re",
                  "title":"See all recipes",
                  "webview_height_ratio": "full"
                },
                {
                  "title": "Find specific recipe",
                  "type": "postback",
                  "payload": "Rec_Search_"+fire_food
                }
              ]
            }
          }
        };

        sendMessage(senderId, rec_msg);
      }
    }
  }
};
//interactive(wit);
