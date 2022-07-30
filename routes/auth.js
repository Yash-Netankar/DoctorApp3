import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import con from "../models/db.js";
import { getCurrentDate, getCurrentTime, getDayMode } from '../utils/calendar.js';

const authRouter = express.Router();

//REGISTER
authRouter.post("/register", (req, res) => {
    const { name, email, phone, pass, cpass } = req.body.data;

    if (name && email && phone && pass && cpass === pass) {
        // hash the password
        bcrypt.genSalt(10, function (err, salt) {
            if (err)
                return res.json({ success: false, msg: "Internal Server Error Occurred" })
            else {
                bcrypt.hash(pass, salt, function (err, hash) {
                    if (err)
                        return res.json({ success: false, msg: "Internal Server Error Occurred" })
                    else {
                        // save the data into database
                        const sql = "insert into users (name, email, phone, pass) values (?)";
                        con.query(sql, [[name, email, phone, hash]],function (err, result) {
                            if (err)
                                return res.json({ success: false, msg: "Unexpected Error Occurred While Signing Up", error:err.message })
                            else
                                return res.status(201).json({ success: true, msg: "Registered Successfully" })
                        })
                    }
                })
            }
        })
    }

    else res.json({ success: false, msg: "Please provide valid details" })
})



//LOGIN
authRouter.post("/login", async(req,res)=>{
    const {email, pass} = req.body;

    if(email && pass)
    {
        // check if user is registered
        const sql = "select * from users where email = ?";
        con.query(sql, [[email]], async function(err,result){
            if(err){
                return res.status(400).json({ success: false, msg: "Internal Error Occurred", err });
            }

            else if(result.length>0)
            {
                // compare the passwords
                const isPassMatch = await bcrypt.compare(pass, result[0].pass);
                if(isPassMatch)
                {
                    // create a jwt token for user if user and admin if admin
                    let SECRET = undefined;
                    if(result[0].role==="doctor") SECRET = process.env.JWT_SECRET_DOCTOR
                    else if(result[0].role==="admin") SECRET = process.env.JWT_SECRET_ADMIN
                    else if(result[0].role==="user") SECRET = process.env.JWT_SECRET

                    await jwt.sign({uid:result[0].uid, role:result[0].role}, SECRET, function(err, token){
                        if(err)
                            return res.json({ success: false, msg: "Internal Error Occurred", err });
                        else
                        {
                            // check if doctor is checked in to update timings to the patients
                            if(result[0].role==="doctor")
                            {
                                CheckInDoctor(res, result[0], token);
                            }
                            else
                                return res.status(200).json({ success: true, msg: "Logged In Successfully", token, role:result[0].role});
                        }
                    })
                }
                else return res.json({ success: false, msg: "Invalid Credentials" });
            }
            else return res.json({ success: false, msg: "Please sign up to continue" });
        })
    }

    else res.json({ success: false, msg: "Please provide valid details" })
})




// to check in if doctor is logged in and to inform the patients about estimate appointement time
const CheckInDoctor = async (res, admin, token)=>{
    const {uid, name, email, role} = admin;

    const sql = "select id, name, email, check_in_time from check_in where check_in_date = ? and email = ?";
    const checkInQuery = "insert into check_in values (?, ?, ?, ?, ?, ?)";
    const deletePreviousCheckedIns = "delete from check_in where check_in_date != ?";

    const date = await getCurrentDate();
    const time = await getCurrentTime();
    const slot = await getDayMode();

    try
    {
        // delete all the previous records of gone dates
        con.query(deletePreviousCheckedIns, [[date]]);

        con.query(sql, [[date], [email]] ,function(err, result){
            if(err)
                return res.status(500).json({ success: false, msg: "Internal Error Occurred" });

            // if found that doctor is already checked in
            if (result.length > 0) {
                return res.status(200).json({ success: true, msg: "Logged In Successfully", token, role });
            }
            // else add the doctor in check_in table so that patients know he has come & checked in
            else {
                // enter info in db
                const values = [[uid], [name], [email], [time], [slot] ,[date]]
                con.query(checkInQuery, values);
                return res.status(200).json({ success: true, msg: "Logged In Successfully", token, role });
            }
        })
    }
    catch (error)
    {
        return res.status(500).json({ success: false, msg: "Internal Server Error Occurred"});
    }
}




export default authRouter;