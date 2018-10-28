
function tweet() {
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
