var users = require('./data/user.js');
var technologyUsage = require('./data/technologyUsage.js');
var temperatures = require('./data/temperature.js');
var globals = require('./data/global.js');

//var monolithService = function () {


var getTechUsageDuringBedTime = function (userId) {
    var user = users.find(x => x.userId === userId);

    var techUsage = technologyUsage.filter(function (usage) {
        var techUsageAfterBedTime = usage.start.getHours() >= user.sleepHour && usage.start.getMinutes() >= user.sleepMinute;
        var techUsageBeforeWakeUp = usage.start.getHours() <= user.wakeUpHour && usage.start.getMinutes() <= user.wakeUpMinute;
        return usage.userId === userId && (techUsageBeforeWakeUp || techUsageAfterBedTime);
    });

    return techUsage;
};

var getTechUsageDuringBedTimePrep = function (userId) {
    var user = users.find(x => x.userId === userId);

    var techUsage = technologyUsage.filter(function (usage) {
        return usage.userId === userId && usage.start.getHours() >= user.sleepHour - globals.prepHoursBeforeBed && usage.start.getMinutes() >= user.sleepMinute;
    });

    return techUsage;
};

var getNightsTemperatureWithinRecommended = function (userId) {
    var user = users.find(x => x.userId === userId);

    var temperaturesAbove = temperatures.filter(function (t) {
        return t.userId === userId && t.averageTemperature >= globals.minTemperatureRoom && t.averageTemperature <= globals.maxTemperatureRoom;
    });

    return temperaturesAbove;
};

var getNightsTemperatureOutsideRecommended = function (userId) {
    var user = users.find(x => x.userId === userId);

    var temperaturesOutside = temperatures.filter(function (t) {
        return t.userId === userId && t.averageTemperature < globals.minTemperatureRoom || t.averageTemperature > globals.maxTemperatureRoom;
    });

    return temperaturesOutside;
};

var showNotificationBeforeSleep = function (userId) {
    var user = users.find(x => x.userId === userId);
    var now = new Date();
    if (user.sleepHour - now.getHours() > 0 && user.sleepHour - now.getHours() <= 2 && user.sleepMinute <= now.getMinutes()) {
        console.log('Get ready for bed');
    }
};

var showNotificationUsingAppBedTime = function (userId) {
    var user = users.find(x => x.userId === userId);
    var now = new Date();
    var isInSleepPeriod = now.getHours() >= user.sleepHour; //need to fix this
    if (isInSleepPeriod) {
        console.log('Watcha doing here, you should be sleepin');
    }
};

var calculatePoints = function (userId) {
    var user = users.find(x => x.userId === userId);

    var techUsageDuringBedTime = getTechUsageDuringBedTime(userId);
    user.points -= techUsageDuringBedTime.length * 2;

    var nightsTemperatureWithinRecommended = getNightsTemperatureWithinRecommended(userId);
    user.points += nightsTemperatureWithinRecommended.length * 2;

    var nightsTemperatureOutsideRecommended = getNightsTemperatureOutsideRecommended(userId);
    user.points -= nightsTemperatureOutsideRecommended.length * 2;

    return user.points;
};

var userIds = [1, 2, 3, 4];

userIds.forEach(function (userId) {
    var user = users.find(x => x.userId === userId);
    console.log(user.userName + ' - points b4: ' + user.points + ' - points after: ' + calculatePoints(userId));
});

showNotificationBeforeSleep(1);

showNotificationUsingAppBedTime(2);


console.log('\nuser 1 tech usage past bed time');
getTechUsageDuringBedTime(1).map(function (t) {
    return console.log(t.source + ' - ' + t.start);
});

console.log('\nuser 2 tech usage during prep time');
getTechUsageDuringBedTimePrep(2).map(function (t) {
    return console.log(t.source + ' - ' + t.start);
});

console.log('\nuser 1 temperatures within recommended range');
getNightsTemperatureWithinRecommended(1).map(function (t) {
    return console.log(t.averageTemperature + ' celsius - ' + t.date);
});

console.log('\nuser 1 temperatures outside recommended range');
getNightsTemperatureOutsideRecommended(1).map(function (t) {
    return console.log(t.averageTemperature + ' celsius - ' + t.date);
});