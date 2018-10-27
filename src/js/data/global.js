var getBedTime = function (user) {
    var bedTime = new Date();
    bedTime.setHours(user.sleepHour+1);
    bedTime.setMinutes(user.sleepMinute);
    return bedTime;
};

module.exports = {
    minTemperatureRoom: 18,
    maxTemperatureRoom: 20,
    prepHoursBeforeBed: 2,
    getBedTime: getBedTime
}