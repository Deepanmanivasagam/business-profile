const cron = require('node-cron');
const Employee = require('../models/employee');

function isThirdWeekSaturday() {
    const today = new Date();
    if (today.getDay() !== 6) return false;

    let firstSaturday = new Date(today.getFullYear(), today.getMonth(), 1);
    while (firstSaturday.getDay() !== 6) {
        firstSaturday.setDate(firstSaturday.getDate() + 1);
    }

    let thirdSaturday = new Date(firstSaturday);
    thirdSaturday.setDate(firstSaturday.getDate() + 14);

    return (
        today.getDate() === thirdSaturday.getDate() &&
        today.getMonth() === thirdSaturday.getMonth()
    );
}

cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        const isSunday = today.getDay() === 0;
        const isThirdSaturday = isThirdWeekSaturday();

        let reductionCount = 0;
        if (isSunday && isThirdSaturday) {
            reductionCount = 2;
        } else if (isSunday || isThirdSaturday) {
            reductionCount = 1;
        }

        if (reductionCount > 0) {
            await Employee.updateMany(
                { 'leave_balance.publicHolidays': { $gt: 0 } },
                { $inc: { 'leave_balance.publicHolidays': -reductionCount } }
            );
            console.log(`Public holidays reduced by ${reductionCount} for all employees.`);
        } else {
            console.log("No public holidays to reduce today.");
        }
    } catch (error) {
        console.error("Error updating public holidays:", error.message);
    }
});