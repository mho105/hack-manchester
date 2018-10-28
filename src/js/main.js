
init();
var timeInterval = 10000; //10s

var sleepTime = new Date('2018-10-26T22:00:00');
var wakeTime = new Date('2018-10-27T08:00:00');

window.localStorage.setItem('coffee', false);
window.localStorage.setItem('gym', false);
window.localStorage.setItem('outside', false);
window.localStorage.setItem('twitter', false);
window.localStorage.setItem('tweets', JSON.stringify([]));
window.localStorage.setItem('light', true);

var points = 50;
var hasGym, hasCoffee, hasOutside, hasTwitter, hasLight = false;

function init() {
    var intervalID = window.setInterval(poll, 1000);
    var intervalID2 = window.setInterval(checkTwitter, 5000);

    function poll() {
        detectGym();
        detectCoffee();
        detectOutside();
        detectLight();
        changeSlothPic();
    }

    function checkTwitter() {
        detectTwitter();

        changeSlothPic();
    }

    detectMovement();
    detectLight();
    changeSlothPic();
}

function changeSlothPic() {
    var image = document.getElementById("sloth-img");
    var score = document.getElementById("sloth-points");

    if (points < 50) {
        score.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        image.src = 'img/sloth-small.png';
    }


    if (points >= 50) {
        score.style.backgroundColor = 'rgba(0,102,0,1)';
        image.src = 'img/sloth-happy.png';
    }
       
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
    var tweets = JSON.parse(localStorage.getItem("tweets"));
    var now = new Date();
    var tenSecondsAgo = new Date(now.setSeconds(now.getSeconds() - 10));

    var tweetsInLastSeconds = tweets.filter(function (tweetTime) {
        return new Date(tweetTime) >= tenSecondsAgo;
    });

    if (tweetsInLastSeconds.length) {
        addCross('twitter');
        subtractPoints(10);
    }
    else
        addPoints(2);
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

function detectLight() {
    if(!hasLight && window.localStorage.getItem('light') == 'false') {
        addTick('light');
        addPoints();
        hasLight = true;
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

function subtractPoints(toSubtract) {
    if (!toSubtract)
        toSubtract = 10;

    points = points - toSubtract;
    document.getElementById('points').innerText = points;
}

function addPoints(toAdd) {
    if (!toAdd)
        toAdd = 10;

    points = points + toAdd;
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