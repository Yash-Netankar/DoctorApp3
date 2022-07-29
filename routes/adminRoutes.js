import express from "express";
import { authorizeAdmin } from "../middlewares/authorize.js";
import con from "../models/db.js";
import { getCurrentDate } from "../utils/calendar.js";
import { Mail } from "../utils/mail.js";
const adminRouter =  express.Router();

adminRouter.get("/getAppointments", authorizeAdmin ,(req,res)=>{
    const sql = "select * from appointments";

    con.query(sql, function (err, result) {
        if (err) return res.json({ success: false, msg: "Unexpected problem occurred while getting appointments" });

        else if (result.length > 0) return res.json({ success: true, data: result })

        else return res.json({ success: false, msg: "No Appointments Found" });
    })
})


adminRouter.post("/getTodayAppointments", authorizeAdmin, async(req, res)=>{
    const {slot} = req.body;
    const date = await getCurrentDate();
    const sql = "select * from appointments where slot = ? && appointmentDate = ?";
    
    slot &&
    con.query(sql, [[slot], [date]], (err, result)=>{
       if(err) res.json({success:false, msg:"Unexpected error occurred", err})
       else if(result.length>0){
          return res.status(200).json({success:true, data:result})
       }
       else return res.json({success:false, msg:"Cannot find any appointments today!!", err})
    })
 })


adminRouter.post("/operation", authorizeAdmin , (req,res)=>{
    const {ids, emails,  op} = req.body;

    let status = op === "approve" ? 1 : -1;
    let sql = `update appointments set status = ${status} where id = `;

    // query to update multiple ids at same time with help of appending the string with OR in sql
    ids.map((id, index)=>{
        if(index==0)
            sql += `${id}`

        else
            sql += ` or id=${id}`
    })

    con.query(sql, function(err, result){
        if(err)
            return res.json({success:false, msg:"Internal Server Error Occurred"});

        else if(result.affectedRows>0)
        {
            let msg;
            if(result.affectedRows==1 && status==-1)
                msg=`1 Appointment Rejected`
            else if(result.affectedRows>1 && status==-1)
                msg=`${result.affectedRows} Appointments Rejected`
            else if(result.affectedRows==1 && status==1)
                msg=`1 Appointment Approved`
            else if(result.affectedRows>1 && status==1)
                msg=`${result.affectedRows} Appointments Approved`
            
            // sending mails to users
            let appointmentStatus = status==1 ? "Approved": "Rejected";
            // emails.forEach(email => {
            //     if(email && email!==null && email!=="")
            //     {
            //         Mail(email, appointmentStatus);
            //     }
            // });

            return res.json({success:true, msg})
        }
        else
            return res.json({success:false, msg:"Internal Server Error Occurred"});
    })
})

export default adminRouter;