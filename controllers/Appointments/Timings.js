export const MorningAppointmentTimings = (token, email, appointements, LoggedDoctors) => {
    let time = {
        hour: 0,
        minutes: 0
    }

    // assign the checkin time of doctors
    LoggedDoctors.map(doctors => {
        if (doctors.slot === "morning") {
            time.hour = parseInt(doctors.check_in_time.split(":")[0]);
            time.minutes = parseInt(doctors.check_in_time.split(":")[1]);
        }
    })

    let vaccination_time = 5;
    let normal_time = 10;
    let emergency_time = 20

    appointements = appointements.map((appointement, index) => {
        if (appointement.token <= token && appointement.slot === "morning") {
            // update the time accourding to clock
            if (time.minutes >= 59) {
                time.minutes = 0;
                if (time.hour > 24) time.hour = 1;
                else time.hour = time.hour + 1;
            }

            switch (appointement.appointmentType) {
                case "vaccination":
                    time.minutes = time.minutes + vaccination_time
                    break;

                case "normal":
                    time.minutes = time.minutes + normal_time
                    break;

                case "emergency":
                    time.minutes = time.minutes + emergency_time
                    break;
            }
            // update the time accourding to clock
            if (time.minutes >= 59) {
                time.minutes = 0;
                if (time.hour > 24) time.hour = 1;
                else time.hour = time.hour + 1;
            }
            if (appointement.pemail === email) {
                appointement = { ...appointement, time:{...time} }
                return appointement
            }
        }
    });

    appointements = appointements.filter(app => app && app) // to remove undefined caused due to maping
    return appointements;
}



export const EveningAppointmentTimings = (token, email, appointements, LoggedDoctors) => {
    let time = {
        hour: 0,
        minutes: 0
    }

    LoggedDoctors.map(doctors => {
        if (doctors.slot === "evening") {
            time.hour = parseInt(doctors.check_in_time.split(":")[0]);
            time.minutes = parseInt(doctors.check_in_time.split(":")[1]);
        }
    })

    let vaccination_time = 5;
    let normal_time = 10;
    let emergency_time = 20;
    let str = [];

    let newAppointements = appointements.map((appointement, index) => {
        if (appointement.token <= token && appointement.slot === "evening") {
            // update the time accourding to clock
            if (time.minutes > 59) {
                time.minutes = 0;
                if (time.hour > 24) time.hour = 1;
                else time.hour = time.hour + 1;
            }
            switch (appointement.appointmentType) {
                case "vaccination":
                    time.minutes = time.minutes + vaccination_time
                    break;

                case "normal":
                    time.minutes = time.minutes + normal_time
                    break;

                case "emergency":
                    time.minutes = time.minutes + emergency_time
                    break;
            }
            // update the time accourding to clock
            if (time.minutes > 59) {
                time.minutes = 0;
                if (time.hour > 24) time.hour = 1;
                else time.hour = time.hour + 1;
            }

            if (appointement.pemail === email) {
                return { ...appointement, time:{...time}}
            }
        }
    });

    newAppointements = newAppointements.filter(app => app && app) // to remove undefined caused due to maping
    return newAppointements;
}