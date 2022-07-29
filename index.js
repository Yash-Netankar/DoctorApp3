import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";

// importing routes
import userRouter from './routes/userRoutes.js';
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/auth.js";
import doctorRouter from './routes/doctorRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

app.use(express.json("limit: 100mb"));
app.use(cors());

// using routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);

/********** SOCKET FOR REALTIME DOCTOR STATUS ***********/
const io = new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

let onlineDoctors = {};

io.on('connection', async(socket) => {
    socket.on("doctor-connected", ({status, id}) => {
        if(status==1){
            if(!Object.values(onlineDoctors).includes(id)) onlineDoctors[socket.id] = id
        }
        else delete onlineDoctors[socket.id]
        socket.broadcast.emit("getDocStatus", onlineDoctors)
    })

    socket.on("initial-status", () => {
        socket.emit("doc-initial-status", onlineDoctors)
    })

    socket.on("disconnect", () => {
        delete onlineDoctors[socket.id]
        socket.broadcast.emit("getDocStatus", onlineDoctors)
    })
})



app.get("/", (req,res)=>{
    res.send("<h1>Hello from App</h1>")
    res.end();
})


server.listen(PORT, (err) => {
    if (err) process.exit(0);
    console.log("Listening on PORT", PORT);
})