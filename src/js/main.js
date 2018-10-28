
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

    var lastX, lastY, lastZ;
    var moveCounter = 0;

    function handleMotion(e) {
        let acc = e.acceleration;
        if(!acc.hasOwnProperty('x')) {
            acc = e.accelerationIncludingGravity;
        }
    
        if(!acc.x) return;
    
        //only log if x,y,z > 1
        if(Math.abs(acc.x) >= 1 &&
        Math.abs(acc.y) >= 1 &&
        Math.abs(acc.z) >=1) {
            //console.log('motion', acc);
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
                console.log('SHAKE!!!');
                moveCounter = 0;
            }
    
            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
            
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