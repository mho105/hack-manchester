
function tweet() {
    var tweets = JSON.parse(localStorage.getItem("tweets"));
    if (tweets == null) tweets = [];
    tweets.push(new Date());
    localStorage.setItem("tweets", JSON.stringify(tweets));
    
    window.localStorage.setItem('twitter', true);
}

function changeLocation() {
    var e = document.getElementById("location");
    var location = e.options[e.selectedIndex].value;
    
    if(location === 'coffee') {
        window.localStorage.setItem('coffee', true);
    } 
    
    if(location === 'gym') {
        window.localStorage.setItem('gym', true);
    } 
    
    if (location === 'outside') {
        window.localStorage.setItem('outside', true);
    }
}

function changeLight() {
    window.localStorage.setItem('light', true);
}

function changeDark() {
    window.localStorage.setItem('light', false);
}


