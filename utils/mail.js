import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const transporter  = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    },
});


export const Mail = async (email, status)=>{

    let isRejected = status==="Rejected" ? true : false;

    try {
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:`${email}`,
            subject:`Appointment ${status}`,
            html:`
            <p>Dear user,</p><br/>
            <p>Your Appointment has been <strong>${status}</strong>.</p><br/>.`
        })
    }
    catch (error)
    {
        console.log(error)
    }
}