const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const _ = require('lodash');
const CLIENT_ACCESS_TOKEN="9032b2108216477788e5b48de04905a8";

const apiai = require('apiai');
const apiaiApp = apiai(CLIENT_ACCESS_TOKEN);

const PAGE_ACCESS_TOKEN ="EAASj4LeowksBABvsYBDGIWXkNyVY6NeVQieCrnm72ZCZAVGaRiyEnKuZC9Y7cCUHuhOKQIAb8z5dWaSrGWNdTQ3VkYZAofKStq4BpHeBTGPdXLNzNPIXrHPY47YgF2LTisCZCHcd27lyIzZAZCc5AKAabZBZBZCDThy0LTcyp671RH9QZDZD";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

/*function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}*/

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });

  apiai.on('response', (response) => {
    console.log('LOL: ',response);
    var acronym = response.result.parameters.acronym;
    if( acronym === 'DIL'){
        text = 'Data innovation Lab';
    }
    else if(acronym === 'AGPC'){
        text = 'AXA Global Property and Casuality';
    }
    else if(acronym === 'IAM'){
        text = 'Identity Access Management';
    }
    else if(_.isEmpty(response.result.parameters) && response.result.action ==='input.welcome'){
        text = response.result.fulfillment.speech;
    }
    else{
        text = "I'm not trained for that yet :(";
    }
    

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: text}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}