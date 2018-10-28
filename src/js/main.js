
init();

var sleepTime = new Date('2018-10-26T22:00:00');
var wakeTime = new Date('2018-10-27T08:00:00');

var points = 50;

function init() {
    var intervalID = window.setInterval(poll, 5000);

    function poll() {
        calculatePoints();
    }

    detectMovement();
}

function detectMovement() {
    var listener = window.addEventListener("devicemotion", handleMotion, true);

    var lastX, lastY, lastZ;
    var moveCounter = 0;

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
                addCross('device');
                subtractPoints()
                moveCounter = 0;
                window.removeEventListener('devicemotion', listener);
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

function subtractPoints() {
    points = points - 10;
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