/* * Consts and vars * */
const send = document.querySelector("#send");
const userInputContainer = document.querySelector(".user-input-container");
const playAgain = document.querySelector("#playAgain");
const chronoHTML = document.querySelector("#chrono");
let scoreHTML = document.querySelector("#score");
const scoreTextHTML = document.querySelector("#scoreText");
const scoreHistoryHTML = document.querySelector("#scoreHistory");
const codeLength = document.querySelector("#codeLength");
let userInput = document.querySelector("#userInput");
const checkingAnswer = document.getElementById("checkingAnswer")
const numericButtonInputs = document.getElementsByClassName('numeric-btn-input');
const form = document.getElementById("secretCodeForm");
let minutesInterval = '';
let secondsInterval = '';
let gameIsOver = false;
let chrono = {minutes: 0, seconds: 60};
let score = 1000;
const userInputValue = [];
const secretCodeText = document.querySelector("#secretCode");
const pattern = /[0-9]/g;
const error = document.querySelector("#error");

/** * ** Functions ** * **/

const secretCode = getRandomInt(9999);

codeLength.innerHTML = `Le code secret contient ${secretCode.toString().length} chiffres`;

function createUnderscoresCode () {
    let underscores = "";
    for (i=0; i<secretCode.toString().length; i++) {
        underscores += "_"
    }
    userInputContainer.dataset.underscores = underscores;
}

createUnderscoresCode();


/* Add of the event listner on every buttons */
for (let i = 0; i < numericButtonInputs.length; i++) {
    numericButtonInputs[i].addEventListener('click', function() {
        addNumber(numericButtonInputs[i]);
    });
}

//console.log("secretCode", secretCode);

userInput.addEventListener('change', checkingInput);

function checkingInput() {
    let correspondingButton;
    let val = userInput.value;
    const checkingNumber = val.match(pattern);
    if ((checkingNumber != null) && (val.length == checkingNumber.length)) {
        error.setAttribute("hidden", true);
        console.log('valide la regex');
        if (val.length === 1) {
            correspondingButton = document.querySelector(`#input-${val}`);
        } else {
            correspondingButton = document.querySelector(`#input-${val.substring(val.length - 1)}`);
        }
        addNumber(correspondingButton);
    } else {
        error.removeAttribute("hidden");
    }
}

function addNumber(numericTouch) {
    userInputValue.push(numericTouch.value.toString());
    
    let val = numericTouch.value.toString();
    const stringCode = secretCode.toString();
    let inputLength = userInputValue.length;
    console.log('length :', inputLength);
    if (inputLength > 0) {
        if (stringCode[inputLength - 1] === val) {
            userInput.value += val;
            numericTouch.style.backgroundColor = "green";
            numericTouch.style.color = "white";
            if(secretCode.toString() === userInput.value) {
                endGame();
            }
            return(0);
        }
        
    }
    if (stringCode.includes(val)) {
        numericTouch.style.backgroundColor = "rgb(255, 102, 0)";
        numericTouch.style.color = "white";
        userInputValue.pop();
    }

    if (stringCode.includes(val) != true) {
        numericTouch.style.backgroundColor = "red";
        numericTouch.style.color = "white";
        userInputValue.pop();
    }
    
}

/* Generate random number */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function handleForm(event) { 
    event.preventDefault();
    if (parseInt(userInput.value) !== secretCode) {
        console.log(`Vous avez saisie : ${userInput.value}`);
        checkingAnswer.innerHTML = "Ce n'est pas le code";
    } else {
        console.log(`Vous avez saisie : ${userInput.value}`);
        checkingAnswer.innerHTML = "Bien joué !";
    }
}

//form.addEventListener('submit', handleForm);
playAgain.addEventListener('click', game);

function endGame() {
    gameIsOver = true;
    stopChronoSec();
    stopChronoMin();
    for (let i = 0; i < numericButtonInputs.length; i++) {
        if (numericButtonInputs[i].getAttribute('listener') !== 'true') {
            numericButtonInputs[i].removeEventListener("click", console.log("event lister removed"));
        }
    }
    if ((chrono.minutes == 0) && (chrono.seconds == 1)) {
        score = 0;
        chrono.seconds = 0;
    }
    scoreHTML.innerHTML = `Score : ${score} points`;
    const actualScore = sessionStorage.setItem("actualScore", score);
    console.log('Fin du jeu');
    chronoHTML.innerHTML = "00:00";
    scoreHTML.removeAttribute("hidden");
    playAgain.removeAttribute("hidden");

    if ((chrono.minutes === 0) && (chrono.seconds === 0)) {
        secretCodeText.innerHTML = `Le code était : ${secretCode}`;
    } else {
        console.log("chrono", chrono.minutes, chrono.seconds)
    }
    window.location.href = "score.html";
}

async function gameCounterSec() {
    setTimeout(updateChronoSeconds, 1000);
}

async function gameCounterMin() {
    setTimeout(updateChronoSeconds, 60000);
}

async function gameCounter(gameDelay) {
    setTimeout(endGame, gameDelay);
}

function stopChronoMin() {
    clearInterval(Interval);
}

function stopChronoSec() {
    clearInterval(secondsInterval);
}

function stopChronoMin() {
    clearInterval(minutesInterval);
}

function updateChronoMinutes() {
    if (chrono.minutes > 0) {
        chrono.minutes -= 1;
        if ((chrono.minutes >= 10) && (chrono.seconds >= 10)) {
            chronoHTML.innerHTML = `${chrono.minutes}:${chrono.seconds}`
        } else if ((chrono.minutes >= 10) && (chrono.seconds < 10)) {
            chronoHTML.innerHTML = `${chrono.minutes}:0${chrono.seconds}`;
        }
         else if ((chrono.minutes < 10) && (chrono.seconds >= 10)) {
            chronoHTML.innerHTML = `0${chrono.minutes}:${chrono.seconds}`;
        } else if ((chrono.minutes < 10) && (chrono.seconds < 10)) {
            chronoHTML.innerHTML = `0${chrono.minutes}:0${chrono.seconds}`;
        }
    } else {
        stopChronoMin();
        return(0);
    }
}

function updateChronoSeconds() {
    if (chrono.seconds > 1) {
        chrono.seconds -= 1;
        score = Math.floor(Math.pow(1.123, chrono.seconds));
        console.log(score);
        if ((chrono.minutes >= 10) && (chrono.seconds >= 10)) {
            chronoHTML.innerHTML = `${chrono.minutes}:${chrono.seconds}`
        } else if ((chrono.minutes >= 10) && (chrono.seconds < 10)) {
            chronoHTML.innerHTML = `${chrono.minutes}:0${chrono.seconds}`;
        }
         else if ((chrono.minutes < 10) && (chrono.seconds >= 10)) {
            chronoHTML.innerHTML = `0${chrono.minutes}:${chrono.seconds}`;
        } else if ((chrono.minutes < 10) && (chrono.seconds < 10)) {
            chronoHTML.innerHTML = `0${chrono.minutes}:0${chrono.seconds}`;
        }
    } else {
        stopChronoSec();
        return(0);
    }
}

/* Update timer every sec (decrease timer value) */
async function displayChrono() {
    gameCounter(60000);
    minutesInterval = setInterval(updateChronoMinutes, 6000);
    secondsInterval = setInterval(updateChronoSeconds, 1000);
}

let test;
function game () {
    scoreHTML.setAttribute("hidden", true);
    actualScore = sessionStorage.getItem("actualScore");
    displayChrono();
    if (actualScore != null) {
        sessionStorage.setItem("previousScore", actualScore);
        previousScore = sessionStorage.getItem("previousScore");
        scoreTextHTML.removeAttribute("hidden");
        console.log(previousScore);
        scoreHistoryHTML.innerHTML = previousScore.toString();
    }
}

game();

