'use strict';
var Alexa = require("alexa-sdk");
var http = require("http");

var API = 'ec2-34-228-57-81.compute-1.amazonaws.com';



exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getAnswer(question, callback) {
    var postData = JSON.stringify({
        question: question
    });

    var myAPI = {
        host: API,
        path: '/ask/',
        port: 5000,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = http.request(myAPI, function (res) {
            res.setEncoding('utf8');
            var returnData = "";

            res.on('data', function (chunk) {
                returnData = returnData + chunk;
            });

            res.on('end', function () {
                callback(JSON.parse(returnData).answer);
            });

        })
    ;

    // req.write(postData);

    req.end(postData);

}

var handlers = {
    'LaunchRequest': function () {
        this.emit('Welcome');
    },
    'QuestionIntent': function () {
        this.emit('GiveAnswer');
    },
    'Welcome': function () {
        this.response.speak('Hello! I am Bot Ubuntu. Ask your question!')
            .listen('Do you have a question?')
            .cardRenderer('Bot Ubuntu', 'Ask your question!', null);
        this.emit(':responseReady');
    },
    'GiveAnswer': function () {
        var quetype = this.event.request.intent.slots.quetype.value;
        var action = this.event.request.intent.slots.action.value;
        var something = this.event.request.intent.slots.something.value;
        var question = quetype + ' ' + action + ' ' + something + '?';

        getAnswer(question, (answer) => {
            this.response.speak(answer)
                .cardRenderer('Bot Ubuntu', 'Question: ' + question + '\nAnswer: ' + answer, null);
            this.emit(':responseReady');
        });


        // this.response.speak('The question is ' +que)
        //     .cardRenderer('Bot Ubuntu', 'Question: The question is ' + que, null);
        // this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can ask any question about Ubuntu.");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can ask any question about Ubuntu.");
    }
};
