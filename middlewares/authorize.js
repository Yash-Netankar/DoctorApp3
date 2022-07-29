import jwt from 'jsonwebtoken';
import con from '../models/db.js';

export const authorizeUser = async (req, res, next) => {
    let token = req.headers?.authorization.split(" ")[1];
    if (token && token !== "" && token!=="") {
        try {
            // verify token
            const {uid, role} = jwt.verify(token, process.env.JWT_SECRET);
            // find user
            const sql = "select uid, email from users where uid = ? and role = ?";
            con.query(sql, [[uid],[role]], function (err, result) {
                if (err)
                    return res.json({ success: false, msg: "Internal Server Error Occurred" })
                else if (result.length > 0)
                {
                    req.user = result[0];
                    next();
                }
                else
                    return res.status(400).json({ success: false, msg: "No User Found" })
            })
        }
        catch (err) {
            return res.json({ success: false, msg: "Invalid Credentials or Internal Error Occurred" })
        }
    }
    else {
        return res.status(401).json({ success: false, msg: "Session Expired! Please login to continue" })
    }
}





export const authorizeAdmin = async(req, res, next)=>{
    let token = req.headers?.authorization.split(" ")[1];

    if(token && token!==null && token!=="")
    {
        try
        {
            // verify token
            const{uid, role} = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

            // find user
            const sql = "select name, phone, email from users where uid = ? and role = ?";

            con.query(sql, [[uid],[role]], function(err, result){
                if(err)
                    return res.json({msg:"Unexpected Internal Server Error Occurred", success:false})

                else if(result.length>0)
                {
                    req.user=result[0];
                    if(role == "doctor") req.doctorID = uid
                    next();
                }

                else
                    return res.json({ success: false, msg: "No User Found" })
            })
        }
        catch (err) {
            return res.json({ success: false, msg: "Invalid Credentials or Internal Error Occurred" })
        }
    }
    else return res.json({ success: false, msg: "Session Expired! Please login to continue" })
}





export const authorizeDoctor = async(req, res, next)=>{
    let token = req.headers?.authorization.split(" ")[1];

    if(token && token!==null && token!=="")
    {
        try
        {
            // verify token
            const{uid, role} = jwt.verify(token, process.env.JWT_SECRET_DOCTOR);

            // find user
            const sql = "select name, phone, email from users where uid = ? and role = ?";

            con.query(sql, [[uid],[role]], function(err, result){
                if(err)
                    return res.json({msg:"Unexpected Internal Server Error Occurred", success:false})

                else if(result.length>0)
                {
                    req.user=result[0];
                    req.doctorID = uid
                    next();
                }

                else
                    return res.json({ success: false, msg: "No User Found" })
            })
        }
        catch (err) {
            return res.json({ success: false, msg: "Invalid Credentials or Internal Error Occurred" })
        }
    }
    else return res.json({ success: false, msg: "Session Expired! Please login to continue" })
}
