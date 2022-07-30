import axios from "axios";

const getCurrentDate = async(date)=>{
    let currDate = "";

    await axios.get("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
    .then(res => {
        let d = date ? new Date(date) : new Date(res.data.datetime);
        let dt = d.getDate();
        let month = d.getMonth() + 1;
        const year = d.getFullYear();
        
        dt = dt <= 9 ? `0${dt}` : dt;
        month = month <= 9 ? `0${month}` : month;

        currDate = `${dt}-${month}-${year}`;
    })
    .catch(err=>{
        let d = date ? new Date(date) : new Date();
        let dt = d.getDate();
        let month = d.getMonth() + 1;
        const year = d.getFullYear();

        month = month <= 9 ? `0${month}` : month;
        dt = dt <= 9 ? `0${dt}` : dt;

        currDate = `${dt}-${month}-${year}`;
        return currDate;
    })

    return currDate
}

const getCurrentTime = async(time)=>{
    try {
        const res = await axios.get("https://timeapi.io/api/Time/current/zone?timeZone=Asia/kolkata");
        // const d = new Date(res.data.datetime)
    
        let hr = res.data.hour;
        let min = res.data.minute;

        if(hr==0) hr=24;

        return {hours:hr, minutes:min}
    }
    catch (error) {
        let t = time ? new Date(time) : new Date();
        const hours = t.getHours();
        const minutes = t.getMinutes();
        return {hours, minutes}
    }
}

const getDayMode = ()=>{
    let currTime = "";
    let d = new Date();

    const hours = d.getHours();

    return hours >= 16 ? "evening" : "morning";
}

export {getCurrentDate, getCurrentTime, getDayMode};