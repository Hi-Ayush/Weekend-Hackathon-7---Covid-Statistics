const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');
const { data } = require('./data');

app.get("/totalRecovered",(req,res)=>{
    let totalRecovered=0;
    data.forEach(state=>totalRecovered+=state.recovered);
    res.send({data: {_id: "total", recovered:totalRecovered}});
})

app.get("/totalActive",(req,res)=>{
    let totalActive=0;
    let totalRecovered=0;
    let totalInfected=0;

    data.forEach(state=>{
        totalInfected+=state.infected;
        totalRecovered+=state.recovered;
    });
    totalActive=totalInfected-totalRecovered;
    res.send({data: {_id: "total", active:totalActive}});
})

app.get("/totalDeath",(req,res)=>{
    let totalDeath=0;
    data.forEach(state=>{
        totalDeath+=state.death;
    });
    res.send({data: {_id:"total", death:totalDeath}});
})

app.get("/hotspotStates",(req,res)=>{
    let hotspot = [];
        data.forEach(state=>{
            let rate = ((state.infected-state.recovered) / state.infected).toFixed(5);
            if(rate > 0.1){
                hotspot.push({
                    state: state.state,
                    rate: rate
                });
            }
        });
        res.send( {data: hotspot});
})
app.get('/healthyStates',(req, res)=>{

        let healthy = [];
        data.forEach(state=>{
            const morality = (state.death / state.infected).toFixed(5);
            if(morality < 0.005){
                healthy.push({
                    state: state.state,
                    morality: morality
                });
            }
        });
        res.send( {data: healthy});
    });

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;