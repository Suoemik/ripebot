const processMessage = require("./processMessage");
const processMessage = require("./processPostback");
module.exports = (req, res) => {
  if (req.body.object === "page") {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          processMessage(event);
        }else if (event.postback) {
          processPostback(event);
        }else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
    res.status(200).end();
  }
};
