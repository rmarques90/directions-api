const scheduler = require('node-schedule');

const {renewAllUserQuotaByDay} = require('../Mongo/user');

const initiateSchedules = () => {

    //every day at 6 am
    const renewQuotaJob = scheduler.scheduleJob('0 0 6 * * *', async (firedate) => {

        let dayFromFireDate = firedate.getDate();

        const count = await renewAllUserQuotaByDay(dayFromFireDate);

        console.log(`Renewed quota for ${count} users!`);

    });

}

module.exports = {
    initiateSchedules
}