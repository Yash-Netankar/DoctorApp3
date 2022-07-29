import mysql2 from "mysql2";

const con = mysql2.createConnection({
    database:"doc_app",
    host:"doctor-app.cdliwwbbhou8.ap-south-1.rds.amazonaws.com",
    port:"3306",
    user:"admin",
    password:"adminpassword",
})

// const con = mysql2.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"doctors_appointment",
// })

con.connect(function(err){
    if(err){
        throw err;
    }
    else
        console.log("Database Connected Successfully :)");
})

export default con
