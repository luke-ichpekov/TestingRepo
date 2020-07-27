let regionMenu = document.querySelector('[region-menu]')
let regionNames = document.querySelectorAll('[region-name]')
let contentContainer = document.querySelector('[content-container]')
let tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0]

function openRegion() {
    if(regionMenu.style.display == "none"){
    regionMenu.style.display = "block"
    contentContainer.style.display = 'none'
}  else {
    regionMenu.style.display = "none"
    contentContainer.style.display = 'block'
}
}



 async function appropriateRegion(region) {

   // let regionCode = 'NA1'

    if(region == 'Brazil'){
        regionCode = 'BR1'    
    }

    if (region == 'Europe NE'){
        regionCode = 'EUN1'
    }

    if(region == 'Europe W'){
        regionCode = 'EUW1'
    }

    
    if(region == 'Latin America N'){
        regionCode = 'LA1'
    }

    if(region == 'Latin America S'){
        regionCode = 'LA2'
    }

    if(region == 'North America'){
        regionCode = 'NA1'
    }

    if(region == 'Oceania'){
        regionCode = 'OC1'
    }

    if(region == 'Russia'){
        regionCode ='RU'
    }

    if(region == 'Turkey'){
        regionCode = 'TR1'
    }

    if(region == 'Japan'){
        regionCode = 'JP1'
    }
    
    if(region == 'Korea'){
        regionCode = 'KR'
       
    }

 console.log(regionCode)
 
let regionData = {regionCode}
let options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body :  JSON.stringify(regionData)
}   
 
   let response = await fetch('https://league-of-legends-site.herokuapp.com/', options)
   let data = await response.json()
   let riotData = (JSON.parse(data.riotData))
   handleData(riotData)
   

}

regionNames.forEach(region  => {
    region.addEventListener('click', () => {
        console.clear()
        openRegion()
        appropriateRegion(region.innerText)
        
    })
})



function handleData(dataReceived) {
    console.log(dataReceived[0])
    let hotStreak = []
    let leaguePoints = []
    let losses = []
    let queueType = []
    let summonerName = []
    let tier = []
    let wins = []
    for(let i= 0; i < dataReceived.length; i++){
       hotStreak.push(dataReceived[i].hotStreak)
       leaguePoints.push(dataReceived[i].leaguePoints)
       losses.push(dataReceived[i].losses)
       queueType.push(dataReceived[i].queueType)
       summonerName.push(dataReceived[i].summonerName)
       tier.push(dataReceived[i].tier)
       wins.push(dataReceived[i].wins)
       
    }




    for(let i = 0; i < dataReceived.length; i ++){
        let newRow = tableRef.insertRow()
        for(let z = 0; z< 6; z++){

            if(z == 0){
                let cell1 = newRow.insertCell(0)
                cell1.innerHTML = i + 1
            }

            if(z ==1){
                let cell2 = newRow.insertCell(1)
                  cell2.innerHTML = leaguePoints[i]
            }
           
            if(z ==2) {
                let cell3 = newRow.insertCell(2)
                cell3.innerHTML = losses[i]
            }
            if(z ==3) {
                let cell4 = newRow.insertCell(3)
                cell4.innerHTML = wins[i]
            }

            if(z ==4) {
                let cell5 = newRow.insertCell(4)
                cell5.innerHTML = summonerName[i]
            }
            if(z ==5) {
                let cell6 = newRow.insertCell(5)
                cell6.innerHTML = tier[i]
            }
        }
      
    }

}
