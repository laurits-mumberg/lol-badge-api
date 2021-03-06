require("dotenv").config();
const axios = require("axios");
let express = require('express');
let app = express();

console.log(process.env.RIOT_API)

app.get('/api', async function (req, res) {
    res.setHeader("Content-Type", "image/svg+xml");
    let name = req.query.name;
    
    //Conventional cache currently set to very low time, as it disables svg/css-animations
    res.setHeader("Cache-Control", `public, max-age=${0.5}`);

    res.send(await MakeLolCard(name));
})

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log(`Listening at http://${host}:${port}`)
})

//TODO: Clean up this function
async function MakeLolCard(name){
    let data = await PrevGameDataCached(name);
    
    if(data != undefined) {
        let {win, kills, deaths, assists} = data;
        let color = win ? "#008000" : "#8B0000";
        return (
        `<svg height="100" width="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <style>
            #border{
                fill: transparent;
                stroke-width: 7;
                stroke-opacity: 0.5;
                stroke: #D3D3D3;
            }
            #borderLine{
                fill: transparent;
                stroke-width: 7;
                stroke: ${color};
                animation: drawBoarder 1s 0s ease-in-out forwards;
            }
            
            @keyframes drawBoarder{
                from{
                stroke-dasharray: 0 800;
                }
                to{
                stroke-dasharray: 800;
                }
            }
            @keyframes fadeToColor{
                from{
                fill: #A9A9A9;
                }
                to{
                fill: ${color}
                }
            }
            @keyframes fadeIn{
                from{
                opacity: 0;
                }
                to{
                opacity: 1;
                }
            }
            
            #icon{
                fill: #A9A9A9;
                animation: fadeToColor 1s 0s linear forwards
            }
            #icon-box{
                transform: translate(10px, 12.5%) scale(1.5,1.5);
            }
            #top-text{
                animation: fadeIn 0.5s 0.25s linear both,
                fadeToColor 1s 0.5s linear forwards;
            }
            #mid-text{
                animation: fadeIn 0.5s 0.5s linear both,
                fadeToColor 1s 0.5s linear forwards;
            }
            #bot-text{
                animation: fadeIn 0.5s 0.75s linear both,
                fadeToColor 1s 0.5s linear forwards;
            }
            text{
                font-family: Helvetica;
                letter-spacing: 1px;
                font-size: 15px;
                font-weight: bold;
                fill: #A9A9A9;
            }
            
            </style>
            @import url('https://fonts.googleapis.com/css?family=Lato');
            <rect id="border" width="300" height="100"/>
            <rect id="borderLine" width="300" height="100"/>
            <g id="icon-box">
            <svg id="icon" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 0 0-.8 1.6L13 8.332v33.336L9.2 45.4A1 1 0 0 0 10 47h29c.304 0 .591-.138.781-.375l5-5A1.002 1.002 0 0 0 44 40H23V4a1 1 0 0 0-1-1H11zm14 4v2c9.925 0 18 8.075 18 18 0 4.144-1.421 7.954-3.783 11h2.469A19.877 19.877 0 0 0 45 27c0-11.028-8.972-20-20-20zm0 4v27h11.59C39.316 35.13 41 31.262 41 27c0-8.822-7.178-16-16-16zm-14 1.74c-3.456 3.394-5.693 8.025-5.97 13.172a20.3 20.3 0 0 0 .047 2.84c.425 4.88 2.616 9.26 5.923 12.508v-2.973A17.9 17.9 0 0 1 7 27a17.9 17.9 0 0 1 4-11.287V12.74zm0 6.531A15.894 15.894 0 0 0 9 27c0 2.802.729 5.436 2 7.729V19.27z"/></svg>
            </g>
            <g transform="translate(100,35)">
            <text id="top-text" x="0" y="00">${name.toUpperCase()}</text>
            <text id="mid-text" x="0" y="22">${win ? "WON" : "LOST"} LAST GAME </text>
            <text id="bot-text" x="0" y="44">GOING ${kills}/${deaths}/${assists}</text>
            </g>
        
        </svg>
        
        `);
    } else {
        if (name == undefined) name = "";
        return (
            `<svg height="100" width="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <style>
                #border{
                    fill: transparent;
                    stroke-width: 7;
                    stroke-opacity: 0.5;
                    stroke: #D3D3D3;
                }
                
                @keyframes drawBoarder{
                    from{
                    stroke-dasharray: 0 800;
                    }
                    to{
                    stroke-dasharray: 800;
                    }
                }
                @keyframes fadeIn{
                    from{
                    opacity: 0;
                    }
                    to{
                    opacity: 1;
                    }
                }
                
                #icon{
                    fill: #A9A9A9;
                }
                #icon-box{
                    transform: translate(10px, 12.5%) scale(1.5,1.5);
                }
                #top-text{
                    animation: fadeIn 0.5s 0.25s linear both;
                }
                #mid-text{
                    animation: fadeIn 0.5s 0.5s linear both;
                }
                #bot-text{
                    animation: fadeIn 0.5s 0.75s linear both;
                }
                text{
                    font-family: Helvetica;
                    letter-spacing: 1px;
                    font-size: 15px;
                    font-weight: bold;
                    fill: #A9A9A9;
                }
                
                </style>
                @import url('https://fonts.googleapis.com/css?family=Lato');
                <rect id="border" width="300" height="100"/>
                <g id="icon-box">
                <svg id="icon" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 0 0-.8 1.6L13 8.332v33.336L9.2 45.4A1 1 0 0 0 10 47h29c.304 0 .591-.138.781-.375l5-5A1.002 1.002 0 0 0 44 40H23V4a1 1 0 0 0-1-1H11zm14 4v2c9.925 0 18 8.075 18 18 0 4.144-1.421 7.954-3.783 11h2.469A19.877 19.877 0 0 0 45 27c0-11.028-8.972-20-20-20zm0 4v27h11.59C39.316 35.13 41 31.262 41 27c0-8.822-7.178-16-16-16zm-14 1.74c-3.456 3.394-5.693 8.025-5.97 13.172a20.3 20.3 0 0 0 .047 2.84c.425 4.88 2.616 9.26 5.923 12.508v-2.973A17.9 17.9 0 0 1 7 27a17.9 17.9 0 0 1 4-11.287V12.74zm0 6.531A15.894 15.894 0 0 0 9 27c0 2.802.729 5.436 2 7.729V19.27z"/></svg>
                </g>
                <g transform="translate(100,35)">
                <text id="top-text" x="0" y="00">${name.toUpperCase()}</text>
                <text id="mid-text" x="0" y="22">NOT FOUND OR </text>
                <text id="bot-text" x="0" y="44">API ERROR</text>
                </g>
            
            </svg>
            
            `);
    }
}

async function PrevGameData(userName){
    console.log("Riot api called")
    if(userName == undefined){
        throw Error();
    }

    let {data} = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(userName)}?api_key=${process.env.RIOT_API}`);
    let accountId = data.accountId;
    
    let matchesData = await axios.get(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${encodeURI(accountId)}?endIndex=1&api_key=${process.env.RIOT_API}`)
    let prevMatchGameId = matchesData.data.matches[0].gameId;
    
    let prevMatchData = await axios.get(`https://euw1.api.riotgames.com/lol/match/v4/matches/${encodeURI(prevMatchGameId)}?api_key=${process.env.RIOT_API}`)
    prevMatchData = prevMatchData.data;
    let userParticipantId = prevMatchData.participantIdentities.find(x => x.player.summonerName.toUpperCase() === userName.toUpperCase()).participantId;
    let userParticipantData = prevMatchData.participants.find(x => x.participantId === userParticipantId);

    return {
        win: userParticipantData.stats.win,
        kills: userParticipantData.stats.kills,
        deaths: userParticipantData.stats.deaths,
        assists: userParticipantData.stats.assists
    }
}

//Should be included as a service i think
let cachedPrevGameData = [];
async function PrevGameDataCached(userName){
    let cachedData = cachedPrevGameData.find(x => x.name == userName);

    //User not found in cache
    if (cachedData == undefined){
        let newData;
        try {
            newData = await PrevGameData(userName)
        } catch (error) {
            newData = undefined
        }
        cachedPrevGameData.push({
            name: userName,
            data: newData,
            date: Date.now()
        });
        return newData
    }
    // User found in cache. Checking for time since last riot api call.
    else if (Date.now() - cachedData.date > 1800000){ //10 sec cache time
        //Update data
        let newData;
        try {
            newData = await PrevGameData(userName);
        } catch (error) {
            newData = undefined;
        }
        cachedData.data = newData
        cachedData.date = Date.now();
        return cachedData.data;
    }
    console.log(userName + " found in cache. cached count: " + cachedPrevGameData.length);
    return cachedData.data;
}