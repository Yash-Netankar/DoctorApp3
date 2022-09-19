// EDIT BASIC DETAILS
const UpdateBasicDetails = (id, name, email, phone, speciality, con, res) => {
    const sql = `update users u, doctors d set u.name = ?, u.email = ?, u.phone = ?, d.speciality = ?, d.name = ? where u.uid = ? and d.did = ?`;

    const values = [[name], [email], [phone], [speciality], [name], [id], [id]];
    try
    {
        con.query(sql, values, (err, result) => {
            if(err){
                return res.json({success:false, msg:"Internal Server Error Occurred"})
            }
            else if(result.changedRows>0){
                return res.json({success:true, msg:"Details updated successfully"})
            }
            else{
                return res.json({success:false, msg:"Could not update details"})
            }
        })
    }
    catch (error){
        return res.json({success:false, msg:"Internal Server Error Occurred"})
    }
}


// EDIT SETTINGS
const UpdateSettings = (id, slots, timings, location, slotsValidity, con, res) => {
    const sql = `update doctors set timings = ?, slots = ?, location = ?, slotsValidity = ? where did = ?`;
    const values = [[timings], [slots], [location], [slotsValidity], [id]];
    try
    {
        con.query(sql, values, (err, result) => {
            if(err){
                return res.json({success:false, msg:"Internal Server Error Occurred"})
            }
            else if(result.changedRows>0){
                return res.json({success:true, msg:"Settings updated successfully"})
            }
            else{
                return res.json({success:false, msg:"Could not update settings"})
            }
        })
    }
    catch (error){
        return res.json({success:false, msg:"Internal Server Error Occurred"})
    }
}

export {UpdateBasicDetails, UpdateSettings}