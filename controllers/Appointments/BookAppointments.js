import con from "../../models/db.js"

// ************BOOK EMERGENCY APPOINTMENT******************
export const bookEmergencyAppointment = (req, res, date, pname, pemail, phone, slot, doctorID, location) => {

    // firstly checking if database has any appointment today if not then create new one for today for specific slot and doctor
    const sql = "select id from appointments where (appointmentDate = ? and slot = ? and doctorID = ?)";
    
    con.query(sql, [[date], [slot], [doctorID]], function (err, result) {
        if (err)
            return res.json({ success: false, msg: "Unexpected problem occurred while booking emergency appointment" });

        // found that today has some appointments already present
        else if (result.length > 0) {
            const sql = `select * from appointments where (appointmentDate = '${date}' and slot = '${slot}' and doctorID = '${doctorID}')`
            con.query(sql, function (err, result) {
                if (err)
                    return res.json({ success: false, msg: "Unexpected problem occurred while booking emergency appointment" });

                // now create token from previous records and add to new appointment
                else if (result.length > 0) {
                    let previousToken = parseInt(result[result.length - 1].token);
                    let newToken = (previousToken+1)%2==0 ? previousToken+2 : previousToken+1;

                    // check that we do not have more than 5 emergency appointments for today here...
                        // saving the appointment in DB
                        const sql = "insert into appointments (pname, pemail, phone, slot, token,  appointmentType, doctorID, appointmentDate, location) values (?)";
                        const values = [pname, pemail, phone, slot, `${newToken}`, 'emergency', doctorID, date, location];

                        con.query(sql, [values], async function (err, result) {
                            if (err)
                                return res.json({ success: false, msg: "Unexpected problem occurred while booking appointment" });
                            else
                                return res.json({ success: true, msg: `Your Appointment is successfully booked. Your token no is ${newToken}` });
                        })
                }
            })
        }

        // no appointments present for today so create a new one
        else if (result.length > 0 === false) {
            // create  and save the new appointment in DB
            const sql = "insert into appointments (pname, pemail, phone, slot, token,  appointmentType, doctorID, appointmentDate, location) values (?)";
            const values = [pname, pemail, phone, slot, '1', 'emergency', doctorID, date, location];

            con.query(sql, [values], async function (err, result) {
                if (err)
                    return res.json({ success: false, msg: "Unexpected problem occurred while booking appointment", err });

                return res.json({ success: true, msg: `Your Appointment is successfully booked. Your token no is 1` });
            })
        }
    })

}




// ************BOOK NORMAL APPOINTMENT******************
export const bookNormalAppointment = (req, res, date, pname, pemail, phone, slot, doctorID, type, location) => {

    // firstly checking if database has any appointment today if not then create new one for today
    const sql = "select id from appointments where (appointmentDate = ? and slot = ? and doctorID = ?)";
    con.query(sql, [[date], [slot], [doctorID]], function (err, result) {
        if (err) {
            return res.json({ success: false, msg: "Unexpected problem occurred while booking appointment" });
        }

        // found that today has some appointments already present
        else if (result.length > 0) {
            const sql = `select * from appointments where (appointmentDate = '${date}' and slot = '${slot}' and doctorID = '${doctorID}')`
            con.query(sql, function (err, result) {
                if (err){
                    console.log(err)
                    return res.json({ success: false, msg: "Unexpected problem occurred while booking appointment" });
                }

                // now create token from previous record and add to new appointment
                else if (result.length > 0) {
                    let previousToken = parseInt(result[result.length - 1].token);
                    let newToken = (previousToken+1)%2==0 ? previousToken+2 : previousToken+1;

                    // check that we do not have more than 50 normal & vaccination appointments for today
                    // if (newToken < 50) {
                        // save the appointment in DB
                        const sql = "insert into appointments (pname, pemail, phone, slot, token,  appointmentType, doctorID, appointmentDate, location) values (?)";
                        const values = [pname, pemail, phone, slot, `${newToken}`, type, doctorID, date, location];

                        con.query(sql, [values], async function (err, result) {
                            if (err){
                                return res.json({ success: false, msg: "Unexpected problem occurred while booking appointment" });
                            }
                                
                            else
                                return res.json({ success: true, msg: `Your Appointment is successfully booked. Your token no is ${newToken}` });
                        })
                    // }
                    // normal & vaccination appointment limit exceeded
                    // else {
                    //     return res.json({ success: false, msg: `Your Appointment has been rejected. Appointment's limit exceeded.` });
                    // }
                }
            })
        }

        // no appointments present for today so create a new one
        else if (result.length > 0 === false) {
            // create  and save the new appointment in DB
            const sql = "insert into appointments (pname, pemail, phone, slot, token,  appointmentType, doctorID, appointmentDate, location) values (?)";
            const values = [pname, pemail, phone, slot, '1', type, doctorID, date, location];

            con.query(sql, [values], async function (err, result) {
                if (err){
                    return res.json({ success: false, msg: "Unexpected problem occurred while getting doctors" });
                }
                    

                return res.json({ success: true, msg: `Your Appointment is successfully booked. Your token no is 1` });
            })
        }
    })
}