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
let app = express()
let apiKey = process.env.API_KEY
let port = 3000
app.use(express.static('public'))
app.use(express.json())
app.listen(port, () => console.log(`listening at port ${port}`))
let url 
let cors = require('cors')
const { callbackify } = require('util')
const { parse } = require('path')
//const { response } = require('express')
//const { json } = require('express')
app.use(cors())
app.use(bodyParser.json())
app.options('*', cors())
headers: {"Access-Control-Allow-Origin", "*"}



app.get('/', function(req, res)  {
  res.write('SERVER PAGE')
  res.end()
})




//searchbar post
app.post('/userInput', (req, res) => {
let summonerName = req.body.userInput
let summonerRegion = req.body.regionCode
summonerURL = `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`
getSummonerID(summonerURL)
app.use (function(req, res, next ) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', 'GET, POST, DELETE, PUT')
  res.header('Access-Control-Allow-Origin', 'Content-Type')
  next()
})



//get summoner account shit, like ID and account NUM ect 
function getSummonerID(summonerURL){
  https
  .get(summonerURL, (resp) => {
    let data =''

    resp.on('data', (chunk) => {
      data += chunk
    })
    resp.on("end", () => {
      let initialResponse = data
      parsedInitialResponse = JSON.parse(initialResponse)
      let sumLevel =  parsedInitialResponse.summonerLevel
      let IdNum = parsedInitialResponse.id
      let sumName = parsedInitialResponse.name
      let accouuntId = parsedInitialResponse.accountId
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


//get summoner WIN LOSS, rank that stuff
function callLeagueV4(Id, sumLevel, sumName, accountId){
  let leagueV4URL = `https://${summonerRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${Id}?api_key=${apiKey}`
  https
  .get(leagueV4URL, (resp) => {
    let data =''

    resp.on('data', (chunk) => {
      data += chunk
    })
    resp.on("end", () => {
      let leagueV4Response = data    
      callMatchV4(Id, sumLevel, sumName, accountId, leagueV4Response)
    })
  })
  .on("error", err => {
    console.log("big poo poo " + err.message )
}
)}


//get Summoner last 100 RANKED games
function callMatchV4(Id, sumLevel, sumName, accountId, leagueV4Response){
  let matchV4URL = `https://${summonerRegion}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&api_key=${apiKey}`
  https
  .get(matchV4URL, (resp) => {
    let data =''

    resp.on('data', (chunk) => {
      data += chunk
    })
    resp.on("end", () => {
      let matchV4Response = data
      let JSONSumLevel= JSON.stringify(sumLevel)
      let JSONSumName = JSON.stringify(sumName)

      res.json({
        matchV4Response,
        leagueV4Response,
        JSONSumLevel,
        JSONSumName
        
      })
    })
  })
  .on("error", err => {
    console.log("big poo poo " + err.message )
}
)}

})




app.post('/', (req, res)  => {
  selectedRegion = req.body.regionCode 
  url = `https://${selectedRegion}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=${apiKey}`
  callRiot(url)
  
 function callRiot(url) {  
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
    console.log("big Mistake lul " + err.message )
})




}

function getValue(value) {
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







