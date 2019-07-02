const processMessage = require("./processMessage");
module.exports = (req, res) => {
  if (req.body.object === "page") {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          processMessage(event);
        }else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
    res.status(200).end();
  }
};
