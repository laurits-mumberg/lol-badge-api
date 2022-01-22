const cardCreator = require("./cardCreator");
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


async function MakeLolCard(name){
    let usetGameStats;
    try {
        usetGameStats = await PrevGameDataCached(name)
    } catch (error) {
        let err1, err2, err3;
        
        // Try to get descriptive error msg.
        try {
        [err1, err2, err3] = error.split('\r')
        } catch (error) {
            err1 = 'sorry';
            err2 = 'not';
            err3 = 'working'
        }

        return cardCreator.MakeErrorCard(err1, err2, err3)
    }

   return cardCreator.MakeWinLoseCard(await usetGameStats)
    
}

class UserGameStats{
    constructor(name, win, kills, deaths, assists){
        this.name = name;
        this.win = win;
        this.kills = kills;
        this.deaths = deaths;
        this.assists = assists;
    }
}

class CachedUserGameStats{
    constructor(userGameStats, date){
        this.userGameStats = userGameStats;
        this.date = date;
    }
    dataShouldBeUpdated() {
        return Date.now() - this.date > 1800000
    }
}

// Gets the data from the players most recent game. Returns UserGameStats
async function PrevGameData(userName){
    if(userName == undefined){
        throw 'No user given.\rAdd ?name=(your name)\rto the end of the url';
    }
    
    console.log("Riot api called")
    // Gets puuid, which is a unique id used by riot apis
    let userData;
    try {
        userData = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(userName)}?api_key=${process.env.RIOT_API}`)
    } catch (error) {
        if (error.response.status == 404) { throw (userName + '\rnot found\ron EUW')}
        else { throw 'API\rERROR\r?XD'}
    }
    let puuid = userData.data.puuid;
    console.log('puuid:', puuid)
    
    // Gets the id for the last game
    let matchesData = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURI(puuid)}/ids?api_key=${process.env.RIOT_API}`)
    let prevMatchGameId = matchesData.data[0];
    console.log('gameid: ',prevMatchGameId)
    

    // Gets the data for the specific player
    let prevMatchData = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${encodeURI(prevMatchGameId)}?api_key=${process.env.RIOT_API}`)
    playerSpecificData = prevMatchData.data.info.participants.find(participant => participant.puuid === puuid);
    console.log(playerSpecificData.win)

    return new UserGameStats(userName, playerSpecificData.win, playerSpecificData.kills, playerSpecificData.deaths, playerSpecificData.assists)
}

//Should be included as a service i think
let cachedPrevGameData = [];
async function PrevGameDataCached(userName){

    let cachedData = null;

    // Checks if the user exists in the cache
    if (cachedPrevGameData.length != 0) {
        cachedData = cachedPrevGameData.find(data => data.userGameStats.name == userName)
    };

    //User not found in cache
    if (cachedData == null){
        console.log(userName, ' not found in cache. Calling Riot api')
        let newData;
        try {
            newData = await PrevGameData(userName)
        } catch (error) {
            console.log(error)
            throw error
        }

        //Save result in cache
        cachedPrevGameData.push(new CachedUserGameStats(newData, Date.now()));

        return newData
    }

    // User found in cache. Checking for time since last riot api call.
    else if (cachedData.dataShouldBeUpdated()){
        console.log(userName, ' needs updated data');

        //Update data
        let newData;
        try {
            newData = await PrevGameData(userName);
        } catch (error) {
            throw error
        }
        cachedData.userGameStats = newData
        cachedData.date = Date.now();
        return cachedData.userGameStats;
    }

    // User found in cache, and should not be updated. Data returned.
    console.log(userName + " found in cache. Current count of users in cache: " + cachedPrevGameData.length);
    return cachedData.userGameStats;
}