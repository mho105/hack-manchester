
init();

var sleepTime = new Date('2018-10-26T22:00:00');
var wakeTime = new Date('2018-10-27T08:00:00');

window.localStorage.setItem('coffee', false);
window.localStorage.setItem('gym', false);
window.localStorage.setItem('outside', false);
window.localStorage.setItem('twitter', false);

var points = 50;
var hasGym, hasCoffee, hasOutside, hasTwitter = false;

function init() {
    var intervalID = window.setInterval(poll, 1000);

    function poll() {
        detectGym();
        detectCoffee();
        detectOutside();
        detectTwitter();
    }

    detectMovement();
}

function detectGym() {
    if(!hasGym && window.localStorage.getItem('gym') == 'true') {
        addTick('gym');
        addPoints();
        hasGym = true;
    }
}

function detectCoffee() {
    if(!hasCoffee && window.localStorage.getItem('coffee') == 'true') {
        addCross('coffee');
        subtractPoints();
        hasCoffee = true;
    }
}

function detectOutside() {
    if(!hasOutside && window.localStorage.getItem('outside') == 'true') {
        addTick('outside');
        addPoints();
        hasOutside = true;
    }
}

function detectTwitter() {
    if(!hasTwitter && window.localStorage.getItem('twitter') == 'true') {
        addCross('twitter');
        subtractPoints();
        hasTwitter = true;
    }
}

function detectMovement() {
    var listener = window.addEventListener("devicemotion", handleMotion, true);

    var lastX, lastY, lastZ;
    var moveCounter = 0;
    var hasDetected = false;

    function handleMotion(e) {
        let acc = e.acceleration;
        if(!acc.hasOwnProperty('x')) {
            acc = e.accelerationIncludingGravity;
        }
    
        if(!acc.x) return;
    
        if(Math.abs(acc.x) >= 1 &&
        Math.abs(acc.y) >= 1 &&
        Math.abs(acc.z) >=1) {
            if(!lastX) {
                lastX = acc.x;
                lastY = acc.y;
                lastZ = acc.z;
                return;
            }
    
            let deltaX = Math.abs(acc.x - lastX);
            let deltaY = Math.abs(acc.y - lastY);
            let deltaZ = Math.abs(acc.z - lastZ);
            
            if(deltaX + deltaY + deltaZ > 3) {
                moveCounter++;
            } else {
                moveCounter = Math.max(0, --moveCounter);
            }
    
            if(moveCounter > 2) {
                if(!hasDetected) {
                 addCross('device');
                 subtractPoints();
                 hasDetected = true;
                }
                moveCounter = 0;
            }
    
            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
        }
    }
}


function addCross(id) {
    var element = document.getElementById(id);
    element.classList.add('cross');
}

function addTick(id) {
    var element = document.getElementById(id);
    element.classList.add('tick');
}

function subtractPoints() {
    points = points - 10;
    document.getElementById('points').innerText = points;
}

function addPoints() {
    points = points + 10;
    document.getElementById('points').innerText = points;
}

function calculatePoints() {

    var hasTweeted = getTwitterUsage();

    return {
        twitterUsage: hasTweeted ? true : getTwitterUsage()
    }
}

var getTwitterUsage = function () {
    var tweets = JSON.parse(window.localStorage.getItem('tweets'));

    tweets.forEach(tweet => {
        if(tweet.date >= sleepTime && tweet.date <= wakeTime) {
            console.log('tweet');
            var element = document.getElementById('twitter');
            element.classList.add('cross');
            return true;
        }
    });

    return false;
}