/*jshint esversion: 6 */

const API_AI_TOKEN = "4L7IL5ZCVETHWLHZAYM5QM5ODXW3PQRW";
const apiAiClient = API_AI_TOKEN;
const FACEBOOK_ACCESS_TOKEN = "EAAiBKzzP6RwBAGddy8vEovhklyPnUNFGv7JMh61JZA2lfxIbaeVpN0MmDZBQuwXSZBZBx3b82WXTcddDwgL1k4hnZBoYyWyIxOZAuWDjfljXGF1tkZBZCF6TdH2bbGNrYjAX0Arvp5d49FIrsmZA8CUnaYBG85ZAe0EPFREurqhOYqSiS0GdFhCCiLPwtcvTsZCgkMZD";
const request = require("request");
const {Wit, log} = require('node-wit');
const interactive = require('node-wit').interactive;

const wit = new Wit({
  accessToken: API_AI_TOKEN,
  logger: new log.Logger(log.INFO)
});
const sendMessage = (senderId, msg) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: "POST",
    json: {
      recipient: { id: senderId },
      message: msg,
    }
  });
};
module.exports = (event) => {
  const senderId = event.sender.id;
  const payload = event.postback.payload;
  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: FACEBOOK_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "What grocery item would you like to know about?";
      sendMessage(senderId, {text: message});
    });
  } else if (payload.includes("Go")) {
    let item = payload.split("_")[1];

    var drop_msg = {
      "text": "Choose one:",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Expiration",
          "payload":"Exp_"+item
        },{
          "content_type":"text",
          "title":"Nutrition",
          "payload":"Nut_"+item
        },{
          "content_type":"text",
          "title":"Recipes/Cooking",
          "payload":"Rec_"+item
        },{
          "content_type":"text",
          "title":"Deals",
          "payload":"Deal_"+item
        }
      ]
    };
    sendMessage(senderId, drop_msg);
  }
};
