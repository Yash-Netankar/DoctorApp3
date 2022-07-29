import { getCurrentDate } from "../../utils/calendar.js";

const EditToken = async(req, res, con) => {
    const {email, id, token, slot, appDate} = req.body;
    // check if token is already present
    const date =  await getCurrentDate();
    if(date === appDate)
    {
        const sql = "select token from appointments where (slot=? && appointmentDate=?) && token = ?"
        con.query(sql, [[slot],[date], [token]], (err, result)=>{
            if(err){
                return res.json({success:false, msg:"Internal Server Error Occurred"})
            }
            else if(result.length<1){
                // edit the token now
                const updateQuery = "update appointments set token = ? where slot = ? && id=? && appointmentDate=?";
                con.query(updateQuery, [[token],[slot], [id], [date]], (err, result)=>{
                    if(err){
                        console.log(err)
                        return res.json({success:false, msg:"Server error occurred while updating"})
                    }
                    else if(result.changedRows>0){
                        return res.json({success:true, msg:"Token Updated Successfully"})
                    }
                })
            }
            else if(result.length>0){
                return res.json({success:false, msg:"Cannot edit the token already present"})
            }
        })
    }
    else{
        res.json({success:false, msg:"Cannot edit token of this date"})
    }
}


export {EditToken}