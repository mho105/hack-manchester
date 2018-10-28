

function addTweet() {
    var tweets = [
        { date: new Date('2018-10-27T01:24:00') },
        { date: new Date('2018-10-30T02:24:00') },
        { date: new Date('2018-10-30T03:24:00') }
    ];
       
    var strTweets = JSON.stringify(tweets);
    
    window.localStorage.setItem('tweets', strTweets);
    
    //get 'animal' and rehydrate it  (convert it back JSON)
    var rehydratedAnimal = JSON.parse(window.localStorage.getItem('animal'));


}
