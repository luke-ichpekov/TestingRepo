let regionList = document.querySelector('[region-list]')
let userSumNameInput =  document.getElementById("userInput");
let selectedRegion = document.getElementById('SelectedRegion')
let allRegions = document.querySelectorAll('[regionElement]')
let homeButton = document.querySelector('[homeButton]')
let challengerButton = document.querySelector('[challengerButton]')
let searchBarDiv = document.querySelector('[searchRelated]')
let past100Dive = document.querySelector('[past-100]')
let tableReference = document.getElementById('previousGamesTable').getElementsByTagName('tbody')[0]
let winRateHtml = document.querySelector('[winRate]')
let winsHtmlNum = document.querySelector('[wins]')
let lossHtmlNum = document.querySelector('[losses]')
let tierHtml = document.querySelector('[tier]')
let rankHtml = document.querySelector('[rank]')
let levelHtml = document.querySelector('[level]')
let LPHtml = document.querySelector('[Lp]')
let statPage = document.querySelector('[stat-page]')


function openDropDown(){
    if(regionList.style.display == "none"){
        regionList.style.display = "block"
    }
        
        else {
        regionList.style.display = "none"
}
}


function checkInput(){
    let userInput = document.getElementById("userInput").value;    
    console.log(userInput)
    sendToServer(userInput)
}



async function sendToServer(userInput){
    let regionCode =''

    if(selectedRegion.innerText == 'BR'){
         regionCode = 'BR1'    
    }

    if (selectedRegion.innerText == 'EUN'){
        regionCode = 'EUN1'
    }

    if(selectedRegion.innerText == 'EUW'){
        regionCode = 'EUW1'
    }

    
    if(selectedRegion.innerText == 'LAN'){
        regionCode = 'LA1'
    }

    if(selectedRegion.innerText == 'LAS'){
        regionCode = 'LA2'
    }

    if(selectedRegion.innerText == 'NA'){
        regionCode = 'NA1'
    }

    if(selectedRegion.innerText == 'OCE'){
        regionCode = 'OC1'
    }

    if(selectedRegion.innerText == 'RU'){
        regionCode ='RU'
    }

    if(selectedRegion.innerText == 'TR'){
        regionCode = 'TR1'
    }

    if(selectedRegion.innerText == 'Japan'){
        regionCode = 'JP1'
    }
    
    if(selectedRegion.innerText == 'KR'){
        regionCode = 'KR'
    }


        console.log(`my region is ${regionCode} `)


    let inputData = {regionCode, userInput}
    let options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
    },
    body :  JSON.stringify(inputData)
}   
 try{
 let response = await fetch('https://league-of-legends-site.herokuapp.com/userInput', options)
 let data = await response.json()
 let retrievedSumName = JSON.parse(data.JSONSumName)
 let retrievedSumLevel = JSON.parse(data.JSONSumLevel)
 let leagueV4Parsed = JSON.parse(data.leagueV4Response)
 let last100GamesParsed = JSON.parse(data.matchV4Response)
 console.log(retrievedSumLevel) 
 console.log(retrievedSumName)
 console.log(leagueV4Parsed)
 console.log(last100GamesParsed)
    
  if(leagueV4Parsed.length == 0){
    alert('No ranked games have been played on this account')
 }
    else{
    
if(retrievedSumLevel < 30){
    alert('No ranked games have been played on this account');
} 
else{   
    restyleSite(retrievedSumName, last100GamesParsed, leagueV4Parsed, retrievedSumLevel)
}
}
}
catch(e) {  
    alert('that account does not exist')
}
}


function restyleSite(retrievedSumName, last100GamesParsed, leagueV4Parsed, retrievedSumLevel){
    challengerButton.style.display = 'none'
    homeButton.innerText = retrievedSumName
    homeButton.style.fontSize = '150%'
    homeButton.style.cursor = 'default'
    homeButton.setAttribute('href', '#')
    homeButton.style.left = '400px'
    searchBarDiv.style.display = 'none'
    past100Dive.style.display = 'block'
    let champPlayed = []
    let lanePlayed = []
    let gameNumber = []
    let winsNumber
    let lossNumber
    let winRate
    let tier
    let rank
    let leaguePoints
    statPage.style.display = 'block'

    if(leagueV4Parsed[0].queueType == 'RANKED_SOLO_5x5'){
        winsNumber = leagueV4Parsed[0].wins
        lossNumber = leagueV4Parsed[0].losses
        winRate = Math.round((winsNumber/(winsNumber + lossNumber) *100))
        tier = leagueV4Parsed[0].tier
        rank = leagueV4Parsed[0].rank
        leaguePoints = leagueV4Parsed[0].leaguePoints
    }

    else{
        winsNumber = leagueV4Parsed[1].wins
        lossNumber = leagueV4Parsed[1].losses       
        winRate = Math.round((winsNumber/(winsNumber + lossNumber)) *100)
        tier = leagueV4Parsed[1].tier
        rank = leagueV4Parsed[1].rank
        leaguePoints = leagueV4Parsed[1].leaguePoints
    }

    winRateHtml.innerHTML = winRate +'%'
    winsHtmlNum.innerHTML = winsNumber
    lossHtmlNum.innerHTML = lossNumber
    tierHtml.innerHTML = tier
    rankHtml.innerHTML = rank
    levelHtml.innerHTML = retrievedSumLevel
    LPHtml.innerHTML = leaguePoints


    for(let i = 0; i< last100GamesParsed.matches.length; i++ ){
        let championNumber = last100GamesParsed.matches[i].champion
        lanePlayed.push(last100GamesParsed.matches[i].lane)
        champPlayed.push(getChampionById(championNumber))
        gameNumber.push(i)
    
    }


    for(let i = 0; i < last100GamesParsed.matches.length; i++){
        let additionalRow = tableReference.insertRow()
        for(let z = 0; z < 3; z++){
            if(z==0){
                let firstCell = additionalRow.insertCell(0)
                firstCell.innerText = gameNumber[i] +1
            }
            if(z==1){
                let secondCell = additionalRow.insertCell(1)
                secondCell.innerText = champPlayed[i]
            }
            if(z==2){
                let thirdCell = additionalRow.insertCell(2)
                thirdCell.innerText = lanePlayed[i]
            }

        }
    }


   }
   




userSumNameInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  
        checkInput();
    }
});




allRegions.forEach(region  => {
    region.addEventListener('click', () => {
        let temporaryRegionHold = selectedRegion.innerText
        selectedRegion.innerText = region.innerText
        region.innerText = temporaryRegionHold
        openDropDown()
       
    })
})




function getChampionById(championNumber){
    switch (championNumber) {
        case 1:
            return "Annie";
            break;
        case 2:
            return "Olaf";
            break;
        case 3:
            return "Galio";
            break;
        case 4:
            return "Twisted Fate";
            break;
        case 5:
            return "Xin Zhao";
            break;
        case 6:
            return "Urgot";
            break;
        case 7:
            return "LeBlanc";
            break;
        case 8:
            return "Vladimir";
            break;
        case 9:
            return "Fiddlesticks";
            break;
        case 10:
            return "Kayle";
            break;
        case 11:
            return "Master Yi";
            break;
        case 12:
            return "Alistar";
            break;
        case 13:
            return "Ryze";
            break;
        case 14:
            return "Sion";
            break;
        case 15:
            return "Sivir";
            break;
        case 16:
            return "Soraka";
            break;
        case 17:
            return "Teemo";
            break;
        case 18:
            return "Tristana";
            break;
        case 19:
            return "Warwick";
            break;
        case 20:
            return "Nunu";
            break;
        case 21:
            return "MissFortune";
            break;
        case 22:
            return "Ashe";
            break;
        case 23:
            return "Tryndamere";
            break;
        case 24:
            return "Jax";
            break;
        case 25:
            return "Morgana";
            break;
        case 26:
            return "Zilean";
            break;
        case 27:
            return "Singed";
            break;
        case 28:
            return "Evelynn";
            break;
        case 29:
            return "Twitch";
            break;
        case 30:
            return "Karthus";
            break;
        case 31:
            return "Cho'Gath";
            break;
        case 32:
            return "Amumu";
            break;
        case 33:
            return "Rammus";
            break;
        case 34:
            return "Anivia";
            break;
        case 35:
            return "Shaco";
            break;
        case 36:
            return "Dr.Mundo";
            break;
        case 37:
            return "Sona";
            break;
        case 38:
            return "Kassadin";
            break;
        case 39:
            return "Irelia";
            break;
        case 40:
            return "Janna";
            break;
        case 41:
            return "Gangplank";
            break;
        case 42:
            return "Corki";
            break;
        case 43:
            return "Karma";
            break;
        case 44:
            return "Taric";
            break;
        case 45:
            return "Veigar";
            break;
        case 48:
            return "Trundle";
            break;
        case 50:
            return "Swain";
            break;
        case 51:
            return "Caitlyn";
            break;
        case 53:
            return "Blitzcrank";
            break;
        case 54:
            return "Malphite";
            break;
        case 55:
            return "Katarina";
            break;
        case 56:
            return "Nocturne";
            break;
        case 57:
            return "Maokai";
            break;
        case 58:
            return "Renekton";
            break;
        case 59:
            return "JarvanIV";
            break;
        case 60:
            return "Elise";
            break;
        case 61:
            return "Orianna";
            break;
        case 62:
            return "Wukong";
            break;
        case 63:
            return "Brand";
            break;
        case 64:
            return "Lee Sin";
            break;
        case 67:
            return "Vayne";
            break;
        case 68:
            return "Rumble";
            break;
        case 69:
            return "Cassiopeia";
            break;
        case 72:
            return "Skarner";
            break;
        case 74:
            return "Heimerdinger";
            break;
        case 75:
            return "Nasus";
            break;
        case 76:
            return "Nidalee";
            break;
        case 77:
            return "Udyr";
            break;
        case 78:
            return "Poppy";
            break;
        case 79:
            return "Gragas";
            break;
        case 80:
            return "Pantheon";
            break;
        case 81:
            return "Ezreal";
            break;
        case 82:
            return "Mordekaiser";
            break;
        case 83:
            return "Yorick";
            break;
        case 84:
            return "Akali";
            break;
        case 85:
            return "Kennen";
            break;
        case 86:
            return "Garen";
            break;
        case 89:
            return "Leona";
            break;
        case 90:
            return "Malzahar";
            break;
        case 91:
            return "Talon";
            break;
        case 92:
            return "Riven";
            break;
        case 96:
            return "Kog'Maw";
            break;
        case 98:
            return "Shen";
            break;
        case 99:
            return "Lux";
            break;
        case 101:
            return "Xerath";
            break;
        case 102:
            return "Shyvana";
            break;
        case 103:
            return "Ahri";
            break;
        case 104:
            return "Graves";
            break;
        case 105:
            return "Fizz";
            break;
        case 106:
            return "Volibear";
            break;
        case 107:
            return "Rengar";
            break;
        case 110:
            return "Varus";
            break;
        case 111:
            return "Nautilus";
            break;
        case 112:
            return "Viktor";
            break;
        case 113:
            return "Sejuani";
            break;
        case 114:
            return "Fiora";
            break;
        case 115:
            return "Ziggs";
            break;
        case 117:
            return "Lulu";
            break;
        case 119:
            return "Draven";
            break;
        case 120:
            return "Hecarim";
            break;
        case 121:
            return "Kha'Zix";
            break;
        case 122:
            return "Darius";
            break;
        case 126:
            return "Jayce";
            break;
        case 127:
            return "Lissandra";
            break;
        case 131:
            return "Diana";
            break;
        case 133:
            return "Quinn";
            break;
        case 134:
            return "Syndra";
            break;
        case 136:
            return "AurelionSol";
            break;
        case 141:
            return "Kayn";
            break;
        case 142:
            return "Zoe";
            break;
        case 143:
            return "Zyra";
            break;
        case 145:
            return "Kai'sa";
            break;
        case 150:
            return "Gnar";
            break;
        case 154:
            return "Zac";
            break;
        case 157:
            return "Yasuo";
            break;
        case 161:
            return "Vel'Koz";
            break;
        case 163:
            return "Taliyah";
            break;
        case 164:
            return "Camille";
            break;
        case 201:
            return "Braum";
            break;
        case 202:
            return "Jhin";
            break;
        case 203:
            return "Kindred";
            break;
        case 222:
            return "Jinx";
            break;
        case 223:
            return "TahmKench";
            break;
        case 235:
            return "Senna";
            break;
        case 236:
            return "Lucian";
            break;
        case 238:
            return "Zed";
            break;
        case 240:
            return "Kled";
            break;
        case 245:
            return "Ekko";
            break;
        case 246:
            return "Qiyana";
            break;
        case 254:
            return "Vi";
            break;
        case 266:
            return "Aatrox";
            break;
        case 267:
            return "Nami";
            break;
        case 268:
            return "Azir";
            break;
        case 350:
            return "Yuumi";
            break;
        case 412:
            return "Thresh";
            break;
        case 420:
            return "Illaoi";
            break;
        case 421:
            return "Rek'Sai";
            break;
        case 427:
            return "Ivern";
            break;
        case 429:
            return "Kalista";
            break;
        case 432:
            return "Bard";
            break;
        case 497:
            return "Rakan";
            break;
        case 498:
            return "Xayah";
            break;
         case 516:
            return "Ornn";
            break;
        case 517:
            return "Sylas";
            break;
        case 518:
            return "Neeko";
            break;
        case 523:
            return "Aphelios";
            break;
        case 555:
            return "Pyke";
            break;
        case 875:
            return "Sett";
            break;
        case 876:
            return "Lillia";
            break;
    }

}
