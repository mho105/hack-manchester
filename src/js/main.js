
init();

var sleepTime = new Date('2018-10-26T22:00:00');
var wakeTime = new Date('2018-10-27T08:00:00');

function init() {
    var intervalID = window.setInterval(poll, 5000);

    function poll() {
        calculatePoints();
    }

    detectMovement() ;
}

function detectMovement() {
    window.addEventListener("devicemotion", handleMotion, true);

    function handleMotion(event) {
        var r = event.accelerationIncludingGravity;
        console.log(event);
        if(r.x !== null && r.y !== null && r.z !== null) {
            console.log('has moved');
            var element = document.getElementById('device');
            element.classList.add('cross');
        }
    }
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
        //console.log(sleepTime, wakeTime, tweet.date);

        if(tweet.date >= sleepTime && tweet.date <= wakeTime) {
            console.log('tweet');
            var element = document.getElementById('twitter');
            element.classList.add('cross');
            return true;
        }

        
    });

    return false;
}