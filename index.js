
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set('port', (process.env.PORT) || 3000)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(app.get('port'), () => console.log("Webhook server is listening, port", app.get('port')));
// app.get('/', function (req, res) {
//   res.send('hello world i am a chat bot')
// })
const verificationController = require("./verification");
const messageWebhookController = require("./messageWebhook");
app.get("/", verificationController);
app.post("/", messageWebhookController);
