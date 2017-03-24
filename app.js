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
  console.log('PAPAYA',req.body.entry[0].messaging);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
        else if(event.postback.payload.indexOf('DETAIL')>-1){
            var detailInfo = event.postback.payload.split('_')[1];
            processDetail(event,detailInfo);
        }
      });
    });
    res.status(200).end();
  }
});

function processDetail(event,detailInfo) {
   console.log('process details');
   let sender = event.sender.id;
    var title ='';
    var subtitle='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis vestibulum est, sed tristique diam ullamcorper vitae. Morbi porttitor sit amet nisi nec gravida. Nulla blandit est eu mattis pulvinar. Aliquam blandit facilisis aliquam. Etiam cursus eu justo in ornare. Donec egestas nec erat non tincidunt. Vivamus molestie iaculis arcu vel ornare. Aliquam erat volutpat. Nullam blandit nec mauris et eleifend. Pellentesque rhoncus orci vel neque rhoncus, vitae condimentum leo tincidunt. Curabitur semper risus eget lacinia sodales. Nulla ut justo tristique, vulputate ex non, tristique libero.';
    var acronym = detailInfo;
    if( acronym === 'DIL'){
        title = 'Karim Bouchema';
        subtitle= 'Is born in 1970';
    }
  
    else if(acronym === 'AGPC'){
        title = 'AXA Global Property and Casuality';
    }
    else if(acronym === 'IAM'){
        title = 'Identity Access Management';
    }
    else if(acronym === 'MAG'){
        title = 'Mobile Application Guidelines';
    }
    else if(acronym === 'RUOK'){
        title = 'Are U OK';
    }
    else if(acronym === 'BAU'){
        title = 'Business As Usual';
    }
    else if(acronym === 'FTE'){
        title = 'Full Time Equivalent';
    }
    else if(acronym === 'ISR'){
        title = 'Internal Security Review';
    }
    else if(acronym === 'LS'){
        title = 'Life & Svaings';
    }
    else if(acronym === 'SLA'){
        title = 'Service Level Agreement';
    }
    else if(acronym === 'Steerco'){
        title = 'Steering Comitee';
    }
    else if(acronym === 'MC'){
        title = 'Management Comitee';
    }
   
 
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": title,
				    "subtitle": subtitle,
			    }
                ]
		    }
	    }
    }
  
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: messageData
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });



}



function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
  
  var title ='';
  var subtitle='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis vestibulum est, sed tristique diam ullamcorper vitae. Morbi porttitor sit amet nisi nec gravida. Nulla blandit est eu mattis pulvinar. Aliquam blandit facilisis aliquam. Etiam cursus eu justo in ornare. Donec egestas nec erat non tincidunt. Vivamus molestie iaculis arcu vel ornare. Aliquam erat volutpat. Nullam blandit nec mauris et eleifend. Pellentesque rhoncus orci vel neque rhoncus, vitae condimentum leo tincidunt. Curabitur semper risus eget lacinia sodales. Nulla ut justo tristique, vulputate ex non, tristique libero.';
  var detail ='DETAIL_';
  var img ='https://lh3.ggpht.com/Lt19unBfmJB9QU7DpKqXdlx_zs_zhpcOlLpSY40F_NoPmyZxabk029y7FAV9lFvqEzM=w300';
  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });

  apiai.on('response', (response) => {
    
    var acronym = response.result.parameters.acronym;
    if( acronym === 'DIL'){
        title = 'Data Innovation Lab';
        subtitle= "Is based in Suresnes, brings together 70 data experts";
   
    }
  
    else if(acronym === 'AGPC'){
        title = 'AXA Global Property and Casuality';
    }
    else if(acronym === 'IAM'){
        title = 'Identity Access Management';
    }
    else if(acronym === 'MAG'){
        title = 'Mobile Application Guidelines';
    }
    else if(acronym === 'RUOK'){
        title = 'Are U OK';
    }
    else if(acronym === 'BAU'){
        title = 'Business As Usual';
    }
    else if(acronym === 'FTE'){
        title = 'Full Time Equivalent';
    }
    else if(acronym === 'ISR'){
        title = 'Internal Security Review';
    }
    else if(acronym === 'LS'){
        title = 'Life & Svaings';
    }
    else if(acronym === 'SLA'){
        title = 'Service Level Agreement';
    }
    else if(acronym === 'Steerco'){
        title = 'Steering Comitee';
    }
    else if(acronym === 'MC'){
        title = 'Management Comitee';
    }
    else if(_.isEmpty(response.result.parameters) && response.result.action ==='input.welcome'){
        text = response.result.fulfillment.speech;
    }
    else{
        text = "I'm not trained for that yet :(";
    }
    detail = detail + acronym;
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": title,
				    "subtitle": subtitle,
				    "buttons": [{
					    "type": "web_url",
					    "title": "Contact",
					    "url": "https://en.wikipedia.org/wiki/Minions_(film)",
				    },
                    {
					    "type": "web_url",
					    "title": "Website",
					    "url": "http://www.minionsmovie.com/minions.html",
				    },
                    {
					    "type": "postback",
					    "title": "Who's in charge",
					    "payload": detail,
				    }
                    ],
			    }
                ]
		    }
	    }
    }
   if(_.isEmpty(title)){
       messageData = {text:text};
   }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: messageData
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