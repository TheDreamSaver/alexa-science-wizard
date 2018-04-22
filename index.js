
"use strict";

var Alexa = require("alexa-sdk");
var data = require('./data');
var sciencequiz = require('./sciencequiz');
var debate = require('./debate');
var concepts = require('./concepts');

const subj = data.subjects;
const quiz = sciencequiz.quiz;
const debateTopic = debate.debtop;
const formula = concepts.formulae;
var quizSize = sciencequiz.quizSize.slice();

var handlers = {
   "LaunchRequest": function () {
        this.handler.state = "_EXP";
        this.emitWithState("LaunchIntent");
              
   },

   'AMAZON.CancelIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },


    'SessionEndedRequest': function () {
        this.handler.state = "_EXP";
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.handler.state = "_EXP";
        const message = 'I don\'t get it! Try saying Alexa, open Science Wizard!';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'UnhandledIntent': function() {
        this.handler.state = "_EXP";
        const message = 'I don\'t get it! Try saying Alexa, open Science Wizard!';
        this.response.speak(message);
        this.emit(':responseReady');
    }    

};

var expHandlers = Alexa.CreateStateHandler("_EXP", {

   "LaunchRequest": function () {
    this.handler.state = "_EXP";
    this.emitWithState("LaunchIntent");
          
    },
    "LaunchIntent": function () {
        this.handler.state = "_EXP";
        if(!this.attributes.userId || !this.attributes.sub){
            this.attributes.userId = this.event.session.user.userId;
            let say = "Welcome to Science Wizard. The fun way to learn science with Alexa. You can learn ";
            for (let [key, value] of Object.entries(subj)) { 
                say += `, ${key}`;
            }
            say += ", by doing fun experiments.<break time='0.7s'/> Tired with experiments? you can enjoy a quick quiz to test your awareness of science.<break time='0.7s'/> Prefer discussions over quizzes, science wizard has you covered. You can ask science wizard to act as mediator for debates. Alexa will provide you with a topic to think and debate on with your peers.<break time='0.7s'/> Finally, if you just need a quick refresher on formula of some common science concepts, you can ask science wizard for it like, tell me the formula of speed. So, what do you want to do?";
            this.attributes.lastspeech = say;
            this.response.speak(say).listen("Ask me to repeat or ask for help, if you want to hear the list of features again. You can also find the list of features in the skill's description in your Alexa app."); 
            this.emit(":responseReady");  
        }
        else {
            if(this.attributes.currtopic){
                this.handler.state = "_DEBATE";
                this.emitWithState('DebateLaunchIntent');
            }
            else{
                if(this.attributes.currentStep == -1){
                    let say = `Welcome back. You last completed ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name} of ${this.attributes.sub}. What subject would you like to study about this time? You can learn `;
                    for (let [key, value] of Object.entries(subj)) { 
                        say += `, ${key}`;
                    }
                    delete this.attributes['currentStep'];
                    say += " currently or you can try our science quiz or indulge in a debate this time. So, what do you want to do?";
                    this.attributes.lastspeech = say;
                    this.response.speak(say).listen("Ask me to repeat or ask for help, if you want to hear the list of features again. You can also find the list of features in the skill's description in your Alexa app.");
                    this.emit(":responseReady");   
                }
                else if(!this.attributes.currentStep){
                    let say = `Welcome back. You were studying ${this.attributes.sub} last. You chose ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name}. If you've have arranged the items, are you ready to begin the experiment now?`;
                    this.attributes.lastspeech = say;
                    this.response.speak(say).listen(`If you've have arranged the items, would you like to start experiment ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name} ?`); 
                    this.emit(":responseReady"); 
                }
                else if(this.attributes.currentStep == -2){
                    let say = `Welcome back. You were studying ${this.attributes.sub} last. You chose ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name} last time. What subject would you like to study about? You can learn `;
                    for (let [key, value] of Object.entries(subj)) { 
                        say += `, ${key}`;
                    }
                    delete this.attributes['currentStep'];
                    say += " currently or you can try our science quiz or indulge in a debate this time. So, what do you want to do?";
                    this.attributes.lastspeech = say;
                    this.response.speak(say).listen("Ask me to repeat or ask for help, if you want to hear the list of features again. You can also find the list of features in the skill's description in your Alexa app.");
                    this.emit(":responseReady");   
                }
                else {
                    let say = `Welcome back. You were studying ${this.attributes.sub} last. You were on step ${this.attributes.currentStep} of experiment ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name}. Do you want to continue? `;
                    this.attributes.dontcnt = 1;
                    this.attributes.lastspeech = say;
                    this.response.speak(say).listen(`Do you want to continue from step ${this.attributes.currentStep} of experiment ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name} ?`); 
                    this.emit(":responseReady"); 
                }
            } 
        }
              
   },
   
    "ChooseSubjects": function () {
        this.handler.state = "_EXP";
        var filledSlots = delegateSlotCollection.call(this);
        this.attributes.sub = slotValue(this.event.request.intent.slots.subject);
        let present = false;

        for (let [key, value] of Object.entries(subj)) { 
            if(this.attributes.sub == key){
                present = true;
                break;
            }
        }
        if(present == false){
            let say = `You chose ${this.attributes.sub}. Sorry, we don't offer that subject yet. You can learn `;
            for (let [key, value] of Object.entries(subj)) { 
                say += `, ${key}`;
            }
            say += " currently by doing fun experiments. So which subject would you like to study?";
            this.attributes.lastspeech = say;
            this.response.speak(say).listen("You need to tell the subject would you like to study. If you want to hear the subjects again, say repeat!"); 
            this.emit(":responseReady");    
        }
        else {
            let say = `You chose ${this.attributes.sub}. The different experiments you can conduct in ${this.attributes.sub} are `;
            for (let i =0; i<subj[this.attributes.sub].length; i++){
                say += `${subj[this.attributes.sub][i].name} , `;
            }
            say += "So which experiment number would you like to conduct?";
            this.attributes.lastspeech = say;
            this.response.speak(say).listen("You need to tell the experiment number you want to conduct. If you want to hear the experiments again, say repeat."); 
            this.emit(":responseReady");    
        }   
   },
   
   "ChooseExperiments": function () {
        this.handler.state = "_EXP";
        var filledSlots = delegateSlotCollection.call(this);
        this.attributes.number = slotValue(this.event.request.intent.slots.number);

        if((parseInt(this.attributes.number)- 1)<subj[this.attributes.sub].length){
            let say = `You chose ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name}. `;
            
            say += ` <break time="1s"/> ${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].desc} `;
            
            if(subj[this.attributes.sub][parseInt(this.attributes.number) - 1].ingredients.length > 0) {
                say += "<break time='1s'/> You will need ";
                for(let i = 0; i<subj[this.attributes.sub][parseInt(this.attributes.number) - 1].ingredients.length; i++){
                    say += `${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].ingredients[i]}, `;
                }
                say += " to complete this experiment. Please arrange for these items to complete the experiment. If you've have the items, are you ready to begin the experiment? ";
                
            }
            else {
                say += " You don't need any equipment or ingredient to complete this experiment. Are you ready to begin the experiment?";
            }
            this.attributes.lastspeech = say;
            this.response.speak(`${say}`).listen("Would you like to start with the experiment? If you want to hear the pre requisites again, say repeat."); 
            this.emit(":responseReady"); 
        }
        else {

            let say = `You chose experiment number ${this.attributes.number}. Sorry, we don't have any experiment with that number in ${this.attributes.sub}. The different experiments you can conduct in ${this.attributes.sub} are `;
            for (let i =0; i<subj[this.attributes.sub].length; i++){
                say += `number ${i+1}, ${subj[this.attributes.sub][i].name} , `;
            }
            say += "So which experiment number would you like to conduct?";
            this.attributes.lastspeech = say;
            this.response.speak(say).listen("You need to tell the experiment number you want to conduct. If you want to hear the experiments again, say repeat."); 
            this.emit(":responseReady");  
        }
   },
    
    'AMAZON.RepeatIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak(this.attributes.lastspeech).listen(this.attributes.lastspeech);
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = "_EXP";
        if(this.attributes.dontcnt && this.attributes.dontcnt == 2){
            if(this.attributes.exp){
                delete this.attributes.exp;
            }
            delete this.attributes.dontcnt;
            this.attributes.currentStep = -2;
            this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
            this.emit(':responseReady');
        }
        else{
            if(this.attributes.dontcnt){
                delete this.attributes.dontcnt;
            }
            this.emitWithState('AMAZON.NextIntent');
        }

    },
    'AMAZON.NoIntent': function () {
        this.handler.state = "_EXP";
        if(this.attributes.exp && this.attributes.exp == 1){
            delete this.attributes.exp;
        }
        if(this.attributes.dontcnt && this.attributes.dontcnt == 1){
            this.attributes.dontcnt = 2;
            this.response.speak('Do you want to stop doing this experiment and start something else?').listen('Do you want to stop doing this experiment?');
            this.emit(':responseReady');
        }
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },

    'AMAZON.NextIntent': function () {
        this.handler.state = "_EXP";
        if(this.attributes.exp && this.attributes.exp == 1){
            var say = subj[this.attributes.sub][parseInt(this.attributes.number) - 1].explanation;
            say += `<break time="1s"/> Here are some questions for you to ponder upon and discuss with your friends, teachers and parents, `;
            for(let i =0; i < subj[this.attributes.sub][parseInt(this.attributes.number) - 1].questions.length; i++){
                say += `${subj[this.attributes.sub][parseInt(this.attributes.number) - 1].questions[i]} <break time="1s"/>`;
            }
            say += `I hope you learned something new today! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!`;
            delete this.attributes.exp;
            this.attributes.lastspeech = say;
            
            this.response.speak(say);
            this.emit(':responseReady');
            
        }
        else {
            var currentStep = incrementStep.call(this, 1);
            if(currentStep == subj[this.attributes.sub][parseInt(this.attributes.number) - 1].instructions.length ) {

                this.attributes['currentStep'] = -1;
                this.attributes.exp = 1;
                var say = subj[this.attributes.sub][parseInt(this.attributes.number) - 1].instructions[currentStep - 1];
                this.attributes.lastspeech = say + "You can say next when you are ready to continue. ";
                var reprompt = ' say next to continue. ';
                this.response.listen(reprompt);
                this.response.speak(say + " You can say next when you are ready to continue. ");
                this.emit(':responseReady');

            }
            var say = 'Step ' + currentStep + ', ' + subj[this.attributes.sub][parseInt(this.attributes.number) - 1].instructions[currentStep - 1];
            var reprompt = 'You can say Pause, Stop, or Next and say alexa resume science wizard when you want to resume step ';
            reprompt += currentStep;
            this.response.listen(reprompt);
            
            this.attributes.lastspeech = say + " You can say next when you are ready to continue. ";
            this.response.speak(say + " You can say next when you are ready to continue. ");
            this.emit(':responseReady');
        }
        
    },

    'AMAZON.PreviousIntent': function () {
        this.handler.state = "_EXP";
        // subtract 2 because we will add 1 in AMAZON.NextIntent
        // for a net decrease of 1 which gives us the previous step.
        incrementStep.call(this, -2);
        this.emit('AMAZON.NextIntent');
    },
    'AMAZON.PauseIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak('Okay, you can come back to this skill to pick up where you left off.');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = "_EXP";
        if (!this.attributes['currentStep']) {  // new session
            this.response.speak("Welcome to Science Wizard. The fun way to learn science with Alexa. You can learn by doing fun experiments. Start by choosing a subject, say Alexa, I want to learn physics or maths or biology or any other subject. Then choose an experiment from the various ones available. Alexa will be there to guide you throughout. You can also take a quiz to test your awareness of science. Say Alexa, start science quiz. And if you like debates and discussions, you can say Alexa, start a debate. Alexa will give you a topic to think, discuss and debate, on for and against the motion with your peers. Finally, if you just need a quick refresher on formula of some common science concepts like power, weight, speed etc. , you can ask science wizard for it. Say Alexa, tell me the formula of speed and alexa will tell you and also show it on the card in your companion app. Finally, please see the skill\'s description in the Alexa Companion App for further instructions! So, lots of learning to take place with science wizard but where do you want to start? ").listen("You can ask me to repeat or see the companion app for written instructions.");
        } else {
            var currentStep = this.attributes['currentStep'];
            var say = 'you are on step ' + currentStep + ' of the ' + [this.attributes.sub] +  subj[this.attributes.sub][parseInt(this.attributes.number) - 1].name + ' experiment. Say Next to continue!';
            var reprompt = 'Say Next to continue!';
            this.response.speak(say + reprompt).listen(reprompt);
        }
        this.attributes.lastspeech = say;
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = "_EXP";
        delete this.attributes['currentStep'];
        this.emitWithState('LaunchRequest');
    },

    'QuizIntent': function () {
        this.handler.state = "_QUIZ";
        this.emitWithState('QuizLaunchIntent');
    },

    'DebateIntent': function () {
        this.handler.state = "_DEBATE";
        this.emitWithState('DebateLaunchIntent');
    },

    'FormulaIntent': function () {
        this.handler.state = "_EXP";
        var filledSlots = delegateSlotCollection.call(this);
        let contop = slotValue(this.event.request.intent.slots.formula).toLowerCase();
        let say = "";
        let cardtext = "";
        let cardtitle = "";
        for (let [key, value] of Object.entries(formula)) { 
            if(key == contop){
                say += `${value.speech}. `;
                cardtext += `${value.card}`;
                cardtitle = say;
            }
        }
        say += `Okay, see you next time! Say, Alexa, open Science Wizard whenever you want to interact with Science Wizard again!`;
        this.response.speak(say).cardRenderer(cardtitle, cardtext);
        this.emit(':responseReady');
    },



    'AMAZON.CancelIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    
    
    'SessionEndedRequest': function () {
        this.handler.state = "_EXP";
        this.response.speak("Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.handler.state = "_EXP";
        const message = 'I don\'t get it! Try saying Alexa, Open Science Wizard!';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'UnhandledIntent': function() {
        this.handler.state = "_EXP";
        const message = 'I don\'t get it! Try saying Alexa, Open Science Wizard!';
        this.response.speak(message);
        this.emit(':responseReady');
    }    
    
});


var quizHandlers = Alexa.CreateStateHandler("_QUIZ", {

    'QuizLaunchIntent': function () {
        this.handler.state = "_QUIZ";
        quizSize = sciencequiz.quizSize.slice();
        this.attributes.score = 0;
        this.response.speak('Welcome, to the Science Quiz. Alexa will ask you a question, and you have to tell the correct answer. Let\'s see how many you can answer correctly. Would you like to play?').listen("Ask for help if not sure what to do!"); 
        this.emit(':responseReady');
    },

   'QuizStartIntent': function () {
        this.handler.state = "_QUIZ";
        let outputspeech = "";
        if(this.attributes.score == 0){
            outputspeech += '<say-as interpret-as="interjection">all righty!</say-as> Say the answer is, and the answer. Here is your first question, ';
        }
        if(this.attributes.score != 0){
            outputspeech += 'Right answer. The next question is,';
        }
        
        if(quizSize.length > 0 ) {
            this.attributes.randomizer = Math.floor(Math.random() * (quizSize.length-1));
            outputspeech += ` ${quiz[quizSize[this.attributes.randomizer]].question} . `;
        }   
        this.response.speak(outputspeech).listen("Say the answer is, and the answer.");
        this.emit(":responseReady");
    },


    'AnswerIntent': function () {
        this.handler.state = "_QUIZ";
        this.attributes.answer = slotValue(this.event.request.intent.slots.answer).toLowerCase();
        if(quiz[quizSize[this.attributes.randomizer]].answer == this.attributes.answer){
            quizSize.splice(this.attributes.randomizer,1);
            this.attributes.score += 1;
            if(quizSize.length == 0){
                this.handler.state = "_EXP";
                this.response.speak(`Well done, You completed the game, and got all ${this.attributes.score} of them correctly.`);
                this.emit(':responseReady');
            }
            else {
                this.emitWithState('QuizStartIntent');
            }
        }
        else {
            let finalSpeech = `<say-as interpret-as="interjection">argh!</say-as> Wrong Answer. The correct answer is ${quiz[quizSize[this.attributes.randomizer]].answer}. `;
            if(this.attributes.score<=5){
                finalSpeech += `You need to work more on your science knowledge. You got only ${this.attributes.score} correct. Do you want to play again?`;
            }
            else {
                finalSpeech += `You did good. You got ${this.attributes.score} correct. Do you want to play again?`;
            }
            this.response.speak(finalSpeech).listen('Want to play again?');
            this.emit(':responseReady');
        }
    },


    'AMAZON.YesIntent': function () {
        quizSize = sciencequiz.quizSize.slice();
        this.attributes.score = 0;
        this.emitWithState('QuizStartIntent');
    },
    'AMAZON.NoIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },

    

    'AMAZON.HelpIntent': function () {
        this.handler.state = "_QUIZ";
        this.response.speak("Alexa will ask you a question, and you have to tell the correct answer. Let\'s see how many you can answer correctly. If you are able to answer all of them correctly, you win, else alexa wins. So would you like to play?").listen('Would you like to play?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        delete this.attributes.answer;
        delete this.attributes.randomizer;
        delete this.attributes.score;
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        delete this.attributes.answer;
        delete this.attributes.randomizer;
        delete this.attributes.score;
        this.handler.state = "_EXP";
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        delete this.attributes.answer;
        delete this.attributes.randomizer;
        delete this.attributes.score;
        this.handler.state = "_EXP";
        this.response.speak("Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        delete this.attributes.answer;
        delete this.attributes.randomizer;
        delete this.attributes.score;
        this.handler.state = "_EXP";
        const message = 'I don\'t get it! Try saying Alexa, Open Science Wizard!';
        this.response.speak(message);
        this.emit(':responseReady');
    }
});



var debateHandlers = Alexa.CreateStateHandler("_DEBATE", {

    'DebateLaunchIntent': function () {
        if(this.attributes.currtopic){
            this.handler.state = "_DEBATE";
            let say = `All right. I hope both sides are ready to debate on ${this.attributes.currtopic}. The side speaking for the topic will start speaking now. You have a minute to speak. Your time starts, now!`;
            say += `<break time="10s"/><break time="10s"/><break time="10s"/><break time="10s"/><break time="10s"/><break time="10s"/>`;
            say += ` Time up!. <break time="5s"/>The side speaking against the motion will speak now for a minute. Time starts, now!`;
            say += `<break time="10s"/><break time="10s"/><break time="10s"/><break time="10s"/><break time="10s"/><break time="10s"/>`;
            say += ` That's it. Your time is up! <break time="5s"/>Its now time for the moderator to whisper the results in my ear. So what is the name of the winner?`;
            this.response.speak(say).listen("Say the winner is, and the name of the winner. Ask for help if not sure what to do!"); 
            this.emit(':responseReady');
        }
        else{
            this.attributes.currtopic = debateTopic[Math.floor(Math.random() * (debateTopic.length-1))];
            this.handler.state = "_DEBATE";
            this.response.speak(`Welcome, to Science Wizard. Would you like to debate on ${this.attributes.currtopic}? Say Yes to proceed, or No to choose a different topic.`).listen("If you don't like the topic or want to debate on a debate on a different one say No. Else say Yes."); 
            this.emit(':responseReady');
        }
    },
    'WinnerIntent': function () {
        var filledSlots = delegateSlotCollection.call(this);
        let topi = this.attributes.currtopic;
        let winner = slotValue(this.event.request.intent.slots.winner);
        this.handler.state = "_EXP";
        delete this.attributes.currtopic;
        this.response.speak(`The winner of the debate on ${topi} is ${winner}. Congrats!`); 
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {
        this.handler.state = "_EXP";
        this.response.speak(`All right, So the topic of debate is ${this.attributes.currtopic}. When you are done chosing who is speaking for and who against, and discuss your points, you can say Alexa, ask science wizard to resume debate!`); 
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        this.attributes.currtopic = debateTopic[Math.floor(Math.random() * (debateTopic.length-1))];
        this.handler.state = "_DEBATE";
        this.response.speak(`All right, Would you like to debate on ${this.attributes.currtopic}? Say Yes to proceed, or No to choose a different topic.`).listen("If you don't like the topic or want to debate on a debate on a different one say No. Else say Yes."); 
        this.emit(':responseReady');
    },

    

    'AMAZON.HelpIntent': function () {
        this.handler.state = "_DEBATE";
        this.response.speak("Alexa will give you a topic to think, discuss and debate, on for and against the motion with your peers. Once a topic has been selected you will be given time to think about your points and decide who will be speaking for and who will be speaking against the motion. When you're ready with to debate, you can say, Alexa, ask science wizard to resume debate. Each side will be given a minute to speak and after that the moderator or the teacher will tell Alexa the result, and Alexa will finally announce the winner! So are you ready to debate?").listen('Are you ready to take part in a debate?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = "_EXP";
        delete this.attributes.currtopic;
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = "_EXP";
        delete this.attributes.currtopic;
        this.response.speak('Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.handler.state = "_EXP";
        this.response.speak("Okay, see you next time! Say, Alexa, open Science Wizard, whenever you want to interact with Science Wizard again!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.handler.state = "_EXP";
        delete this.attributes.currtopic;
        const message = 'I don\'t get it! Try saying Alexa, Open Science Wizard!';
        this.response.speak(message);
        this.emit(':responseReady');
    }
});














function incrementStep(increment){
    if (!this.attributes['currentStep'] ) {
        this.attributes['currentStep'] = 1;
    } else {
        this.attributes['currentStep'] = this.attributes['currentStep'] + increment;
        if (this.attributes['currentStep'] < 0) {
          this.attributes['currentStep']=0;
        }
    }
    return this.attributes['currentStep'];
}




function slotValue(slot, useId){
    if(slot.value == undefined){
        return "undefined";
    }
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}


function delegateSlotCollection(){
    console.log("in delegateSlotCollection");
    console.log("current dialogState: "+this.event.request.dialogState);
      if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent=this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
      } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
      } else {
        console.log("in completed");
        console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
      }
  }

if (!Object.entries)
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
};



exports.handler = function (event, context, callback) {

var alexa = Alexa.handler(event, context);
alexa.registerHandlers(handlers, quizHandlers, expHandlers, debateHandlers); 
alexa.dynamoDBTableName = 'scienceWizard';
alexa.execute(); 
  
};
