let http = require('http')
let https = require('https')
let request = require('request')
let express = require('express')
let fetch = require('node-fetch')
let bodyParser = require('body-parser');
require('dotenv').config()
let riotRes
let selectedRegion
let randomVar
let app = express() //declares an express application
let apiKey = process.env.API_KEY
let port = process.env.PORT || 3000  //sets the port
app.use(express.static('public')) //allows express to get access to other files in project
app.use(express.json()) //allows for manipulation of json files
app.listen(port, () => console.log(`listening at port ${port}`)) //starts listening at a port (turns on backend)
let url 
let cors = require('cors')
const { callbackify } = require('util') //importing stuff to debug later
const { parse } = require('path') //deal with paths
//const { response } = require('express')
//const { json } = require('express')
app.use(cors()) //dealing with cors errors from API and front end
app.use(bodyParser.json())
app.options('*', cors())
headers: {"Access-Control-Allow-Origin", "*"} //makes sure we dont get cors errors



app.get('/', function(req, res)  { //test to make sure server is on
  res.write('SERVER PAGE')
  res.end()
})




//searchbar post
app.post('/userInput', (req, res) => {
let summonerName = req.body.userInput //gets name from the input in the search bar
let summonerRegion = req.body.regionCode //gets region from the user selected region
summonerURL = `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}` //gets the url for the api we will call
getSummonerID(summonerURL) //calls function to get id
app.use (function(req, res, next ) { //dealing with cors errors
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', 'GET, POST, DELETE, PUT')
  res.header('Access-Control-Allow-Origin', 'Content-Type')
  next()
})



//get summoner account, ID and account NUM ect 
function getSummonerID(summonerURL){
  https.get(summonerURL, (resp) => {
    let data ='' //declare empty string to populate with incoming data

    resp.on('data', (chunk) => {
      data += chunk //gets api response in chunks, and adds it to empty string
    })
    resp.on("end", () => {
      let initialResponse = data
      parsedInitialResponse = JSON.parse(initialResponse) //parses the json response
      let sumLevel =  parsedInitialResponse.summonerLevel //gets the summoner level from the response
      let IdNum = parsedInitialResponse.id //gets the summoner id number from response
      let sumName = parsedInitialResponse.name //gets the account name from the response
      let accouuntId = parsedInitialResponse.accountId //gets accound id from response
      console.log(`summoner level is ${sumLevel}`)
      console.log(`id number for summoner is ${IdNum}`)
      console.log(`Summoner Name Is ${sumName}`)
      console.log(`Account ID is ${accouuntId}`)
      
      callLeagueV4(IdNum, sumLevel, sumName, accouuntId)

    })
  })
  .on("error", err => {
    console.log("big poo poo " + err.message )
}
)}


//get summoner WIN LOSS, rank
function callLeagueV4(Id, sumLevel, sumName, accountId){
  let leagueV4URL = `https://${summonerRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${Id}?api_key=${apiKey}`
  https.get(leagueV4URL, (resp) => {
    let data =''
//calls api again
    resp.on('data', (chunk) => {
      data += chunk
    })
    resp.on("end", () => {
      let leagueV4Response = data    
      callMatchV4(Id, sumLevel, sumName, accountId, leagueV4Response)
    })
  })
  .on("error", err => {
    console.log("error occured " + err.message )
}
)}


//get Summoner last 100 RANKED games
function callMatchV4(Id, sumLevel, sumName, accountId, leagueV4Response){
  let matchV4URL = `https://${summonerRegion}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&api_key=${apiKey}`
  https.get(matchV4URL, (resp) => {
    let data =''

    resp.on('data', (chunk) => {
      data += chunk
    })
    resp.on("end", () => {
      let matchV4Response = data
      let JSONSumLevel= JSON.stringify(sumLevel) //converts level to json string
      let JSONSumName = JSON.stringify(sumName) //converts summoner name to json string 
  //sends json object to front end with user in-game information.
      res.json({
        matchV4Response,
        leagueV4Response,
        JSONSumLevel,
        JSONSumName
        
      })
    })
  })
  .on("error", err => {
    console.log("error occured callMatchV4 " + err.message )
}
)}

})




app.post('/', (req, res)  => { //post request from frontend
  selectedRegion = req.body.regionCode 
  url = `https://${selectedRegion}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=${apiKey}`
  callRiot(url)
  
 function callRiot(url) {  //get more data from api
https
 .get(url, (resp) => {
     let data = ''

  resp.on('data', (chunk) => {
      data += chunk

  })
  resp.on("end", () => {
   riotRes = data
   getValue(riotRes)
  
})


})
  .on("error", err => {
    console.log("error message sending back data " + err.message )
})




}

function getValue(value) { //sends data for challenger players to front end 
  this.value = value
  riotData = this.value
  res.json({
    riotData
  })
}


})

//let server = http.createServer(function(req, res){
//  res.write('SERVER PAGE')
 // res.end()
//})
 


//server.listen(port, function(error){
//  if(error){
//      console.log('mistake lul ' + error)
//  } else{
//      console.log('server is listening on port ' + port)
//  }
//})







