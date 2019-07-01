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

  if(message == "hi"){
    console.log("Hi there, how are you");
    sendTextMessage(senderId, "Hi there, how are you");
  }else{
console.log("SK: sender ID is "+senderId);

  wit.message(message).then(({entities}) => {
    // You can customize your response to these entities

    console.log("SK: sender ID is "+senderId);
    console.log(entities);
    // For now, let's reply with another automatic message
    sendTextMessage(senderId, "We've received your message: ${text}.");
  })
  .catch((err) => {
    console.error("Oops! Got an error from Wit: ", err.stack || err);
  })
  // const apiaiSession = apiAiClient.textRequest(message, {sessionId: "ripebot2019"});
  // apiaiSession.on("response", (response) => {
  //   const result = response.result.fulfillment.speech;
  //   sendTextMessage(senderId, result);
  // });
  // apiaiSession.on("error", error => console.log(error));
  // apiaiSession.end();
};
}
interactive(wit);
