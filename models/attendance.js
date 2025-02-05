const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    checkIn: {
        type: String,
        required: true,
    },
    checkOut: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
    },
    status: {
        type: String,
    },
});

attendanceSchema.pre('save', function (next) {
    const duration = calculateDuration(this.checkIn, this.checkOut);
    this.duration = duration;

    if (duration >= 8) {
        this.status = 'Present';
    } else if (duration >= 5) {
        this.status = 'Half Day';
    }else if(duration > 2 && duration < 5){
        this.status = `${duration},hrs`
    } 
    else {
        this.status = 'Absent';
    }
    next();
});

function calculateDuration(checkIn, checkOut) {
    const formatTo24Hour = (time) => {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    const checkInMinutes = formatTo24Hour(checkIn);
    const checkOutMinutes = formatTo24Hour(checkOut);
    return (checkOutMinutes - checkInMinutes) / 60; 
}

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;