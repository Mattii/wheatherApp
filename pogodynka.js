
//zmienne wyświetlania 
var display = {
    date: new Date(),
    day: ["Niedziala","Poniedziałek","Wtorek",
          "Środa","Czwartek","Piątek","Sobota"],
    month: ["Stycznia","Lutego","Marca","Kwietnia",
            "Maja","Czerwca","Lipica","Sierpnia",
            "Września","Października","Listopada","Grudnia"],
    disTime: () => {
        var tim = new Date();
        var timeDom = document.querySelector("#time");
        timeDom.innerHTML = `${tim.getHours()}:${(tim.getMinutes() < 10)?"0"+tim.getMinutes():tim.getMinutes()}<sup>${(tim.getSeconds() < 10)?"0"+tim.getSeconds():tim.getSeconds()}</sup>`;
    },
    disDate: function() {
        var dateDom = document.querySelector("#data");
        dateDom.innerHTML = `${this.date.getDate()} ${this.month[this.date.getMonth()]}<br>${this.day[this.date.getDay()]} ${this.date.getFullYear()}`;
    },
    disCloud: (cloud) => {
        var cloudiness = document.querySelector("#cloudiness");
        cloudiness.innerHTML = `${cloud}%`;
    },
    disDewTemp: (dewTemp) => {
        var dewpointTemperature = document.querySelector("#dewpointTemperature");
        dewpointTemperature.innerHTML = `${dewTemp} <sup>o</sup>C`;
    },
    disFog: (fo) => {
        var fog = document.querySelector("#fog");
        fog.innerHTML = fo;
    },
    disHumi: (humi) => {
        var humidity = document.querySelector("#humidity");
        humidity.innerHTML = `${humi}%`;
    },
    disHiClouds: (hiClouds) => {
        var highClouds = document.querySelector("#highClouds");
        highClouds.innerHTML = `${hiClouds}%`;
    },
    disMedClouds: (medClouds) => {
        var mediumClouds = document.querySelector("#mediumClouds");
        mediumClouds.innerHTML = `${medClouds}%`;
    },
    disLowClouds: (lovClouds) => {
        var lowClouds = document.querySelector("#lowClouds");
        lowClouds.innerHTML = `${lovClouds}%`;
    },
    disPressure: (press) => {
        var pressure = document.querySelector("#pressure");
        pressure.innerHTML = press.value + " " + press.unit;
    },
    disTemp: (temp) => {
        var temperature = document.querySelector("#temperature");
        temperature.innerHTML = `${temp} <sup>o</sup>C`;
    },
    disWindDir: (windDir) => {
        var windDirection = document.querySelector("#windDirection");
        var windDirectionData = document.querySelector("#windDirectionData");
        windDirection.style.transform = `rotate(${windDir.deg}deg)`;
        windDirectionData.innerHTML = `${windDir.deg} deg ${windDir.name}`;
    },
    disWindSpe: (winSpe) => {
        var windSpeed = document.querySelector("#windSpeed");
        windSpeed.innerHTML = `${winSpe.mps} mps ${winSpe.beaufort} w skali Boforta`;
    },
    disPreci: (perci) => {
        var precipitation = document.querySelector("#precipitation");
        precipitation.innerHTML = `${perci.value} ${perci.unit}`;
    },
    disSymbol: (sym) => {
        var symbolUrl = `https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&is_night=1&symbol=${sym.number}`;
        var symbolImage = new Image(75,75);
        symbolImage.src = symbolUrl;
        symbolImage.style.animationName = "symbolAnimation";
        symbolImage.setAttribute("class", "mainWhetherImage");
        var symbol = document.querySelector("#symbol");
        symbol.style.animationName = "shadowAnimation";
            if(!document.querySelector(".mainWhetherImage")){
                symbol.appendChild(symbolImage);
            } else {
                symbol.replaceChild(symbolImage,document.querySelector(".mainWhetherImage"));
            }

    },
    disHourPressure: (dp) => {
        var difrenceOfPressure = function(n){
            var calPress = (press - n)*25;
            return y += calPress;
        };
        var canvas = document.getElementById('pressureChamber');
        var ctx = canvas.getContext('2d');
        var x = canvas.width/(dp.length + 1);
        var y = canvas.height/2;
        var press = Math.round(dp[0].value);
        
        ctx.clearRect(0, 0, 600, 300);
            ctx.fillStyle = 'white';
            ctx.font = '25px sans-serif';
            ctx.fillText(`${Math.round(dp[0].value)} ${dp[0].unit}`, 30, 30);
            
            ctx.font = '25px sans-serif';
            ctx.fillText(`${Math.round(dp[dp.length-1].value)} ${dp[0].unit}`, 460, 30);
        
        for(let i in dp){
            
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x, difrenceOfPressure(Math.round(dp[i].value)), 10, 0, Math.PI * 2, true);
            ctx.fill();
            press = Math.round(dp[i].value);
            
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,.6)";
            ctx.lineWidth = 3;
            ctx.moveTo(x, 150);
            ctx.lineTo(x, difrenceOfPressure(Math.round(dp[i].value)));
            ctx.stroke();
            
            ctx.font = '18px sans-serif';
            ctx.fillText(`+${i}h`, x-20, 250);
              
            x+=canvas.width/(dp.length + 1);
        }
    },
    disHourTemp: function(dt) {
        var canvas = document.getElementById('temperatureChamber');
        var ctx = canvas.getContext('2d');
        var x = canvas.width/(dt.length + 1);
        
        ctx.clearRect(0, 0, 600, 300);
        
        ctx.fillStyle = "white";
        ctx.font = "25px sans-serif";
        ctx.fillText(`${Math.round(dt[0])}`, 30, 35);
        ctx.fillText(`o`, 45, 25);
        ctx.fillText(`C`, 60, 35);5
        ctx.fillStyle = "white";
        ctx.font = "25px sans-serif";
        ctx.fillText(`${Math.round(dt[dt.length-1])}`, 505, 35);
        ctx.fillText(`o`, 535, 25);
        ctx.fillText(`C`, 550, 35);
        console.log(dt);
        
        for(let i in dt){
            console.log(Math.round(dt[i]));
        }
    }
}

var geoWhether = {
    lati: 52.2614,
    long: 21.1628,
    objectWhether: [],
    hourArray: [],
    dayArray: {
        thisDayArray: [],
        secondDayArray: [],
        thirdDayArray: [],
        forthDayArray: [],
        fifthDayArray: [],
        sixthDayArray: [],
        seventhDayArray: []
    },
    apiPogody: `https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=52.2614&lon=21.1628&msl=91`,
    getGeo: function(position){
                this.lati = position.coords.latitude;
                this.long = position.coords.longitude;

                this.apiPogody = `https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=${this.lati}&lon=${this.long}&msl=91`;

                getWhetherData(this.apiPogody);
    },
    displayWheteher: function() {
        for(let i = 0; i < this.objectWhether.length;i++){
            if(this.objectWhether[i].from == getCurentDate() && this.objectWhether[i].to == getCurentDate()) {
                console.log(this.objectWhether[i]);
                
                display.disCloud(this.objectWhether[i].location.cloudiness.percent);
                
                display.disDewTemp(this.objectWhether[i].location.dewpointTemperature.value);
                
                display.disFog(this.objectWhether[i].location.fog.percent);
                
                display.disHiClouds(this.objectWhether[i].location.highClouds.percent);
                
                display.disMedClouds(this.objectWhether[i].location.mediumClouds.percent);
                
                display.disLowClouds(this.objectWhether[i].location.lowClouds.percent);
                
                display.disHumi(this.objectWhether[i].location.humidity.value);
                
                display.disPressure(this.objectWhether[i].location.pressure);
                display.disTemp(this.objectWhether[i].location.temperature.value);
                display.disWindDir(this.objectWhether[i].location.windDirection);
                display.disWindSpe(this.objectWhether[i].location.windSpeed);
                display.disPreci(this.objectWhether[i+4].location.precipitation);
                display.disSymbol(this.objectWhether[i+4].location.symbol);
                display.disDate();
                }
            }
        console.log("int");
    },
    timeArray: function() {
        for(var i = 0; i < this.objectWhether.length;i++){
            if(this.objectWhether[i].from === this.objectWhether[i].to){
                this.hourArray.push(this.objectWhether[i]);
            }
        }
    },
    clearArray: function() {
        this.objectWhether = [];
        this.hourArray = [];
        this.dayArray = {
            thisDayArray: [],
            secondDayArray: [],
            thirdDayArray: [],
            forthDayArray: [],
            fifthDayArray: [],
            sixthDayArray: [],
            seventhDayArray: []
        };
        dataProssesing.pressurePrognose = [];
        dataProssesing.tempPrognose = [];
    },
    appdateData: function() {
        var nDate = new Date();
        if(display.date.getHours() != nDate.getHours()){
            console.log("wczesna");
            getWhetherData(geoWhether.apiPogody);
        }
        console.log("ta sama");
        display.date = nDate;
    }

};

var dataProssesing = {
    pressurePrognose: [],
    tempPrognose: [],
    getPrognose: function() {
        for(let i = 0; i < 12;i++){
            this.pressurePrognose.push(geoWhether.hourArray[i].location.pressure);
            this.tempPrognose.push(geoWhether.hourArray[i].location.temperature.value);
        }
        display.disHourPressure(this.pressurePrognose);
        display.disHourTemp(this.tempPrognose);
    },
};
//funkja pobierajaca dane pogotowe
var getWhetherData = (apiPogody) => {
            fetch(apiPogody).then(response => {
                geoWhether.clearArray();
                return response.json();
            }).then(data => {
                //console.log(data);
                geoWhether.objectWhether = data.product.time;
                //wywołanie funkcji 
                geoWhether.timeArray();
                getDayArray();
                geoWhether.displayWheteher();
                dataProssesing.getPrognose();
            })
};

//funkcja tworzaca wzór wyszukiwania godziny 
function getCurentDate(){
    
    var date = new Date();
    var m = (date.getMonth()+1);
    var h = date.getHours();
    var d = date.getDate();
    var plusZero = function (n) {
      if(n < 10){
          return "0" + n;
      }else{
          return n;
      };  
    };
    
    return `${date.getFullYear()}-${plusZero(m)}-${plusZero(d)}T${plusZero(h)}:00:00Z`;
}
function getDayArray() {    
    var date = new Date();
    var month = (date.getMonth()+1);
    var day = date.getDate();
    var year = date.getFullYear();
    
    var isLeap = function(year) {
        if(year%4!=0){
            return false;
        }
        else if(year%100!=0){
            return true;
        }
        else if(year%400!=0){
            return false;
        }
        else
            return true;
        };
    var monthLength = function(year, month) {

	   var tabela = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	   var tabela1 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
        if(isLeap(year) == false){
            return tabela1[month];
        }
        else{
            return tabela[month];
        }
    };
    
    var nMonth = function(m, d, y, add = 0) {
        var da= add + d;
        if(da > monthLength(y,m-1)){
            ++m;
            d = da - d;
        }else{
            d+=add;
        }
        if(m < 10){
            m = "0" + m;
        }
        if(d < 10){
            d = "0" + d;
        }
        return `${m}-${d}`;
    }
    
    var thisDay = date.getFullYear() + "-" + nMonth(month, day, year);
    var secondDay = date.getFullYear() + "-" + nMonth(month, day, year,1);
    var thirdDay = date.getFullYear() + "-" + nMonth(month, day, year,2); 
    var forthDay = date.getFullYear() + "-" + nMonth(month, day, year,3);
    var fifthDay = date.getFullYear() + "-" + nMonth(month, day, year,4);
    var sixthDay = date.getFullYear() + "-" + nMonth(month, day, year,5);
    var seventhDay = date.getFullYear() + "-" + nMonth(month, day, year,6);
              
      for(let i = 0;i < geoWhether.hourArray.length;i++){
            if(geoWhether.hourArray[i].from.match(thisDay)){
                geoWhether.dayArray.thisDayArray.push(geoWhether.hourArray[i]);
            }else if(geoWhether.hourArray[i].from.match(secondDay)){
                geoWhether.dayArray.secondDayArray.push(geoWhether.hourArray[i]);
            }else if(geoWhether.hourArray[i].from.match(thirdDay)){
                geoWhether.dayArray.thirdDayArray.push(geoWhether.hourArray[i]);
            }else if(geoWhether.hourArray[i].from.match(forthDay)){
                geoWhether.dayArray.forthDayArray.push(geoWhether.hourArray[i]);
            }else if(geoWhether.hourArray[i].from.match(fifthDay)){
                geoWhether.dayArray.fifthDayArray.push(geoWhether.hourArray[i]);
            }else if(geoWhether.hourArray[i].from.match(sixthDay)){
                geoWhether.dayArray.sixthDayArray.push(geoWhether.hourArray[i]);
            }else if(geoWhether.hourArray[i].from.match(seventhDay)){
                geoWhether.dayArray.seventhDayArray.push(geoWhether.hourArray[i]);
            }
        }
}

window.addEventListener("DOMContentLoaded", () => {
    
     if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(obj => {geoWhether.getGeo(obj);});
     }
        getWhetherData(geoWhether.apiPogody);
        setInterval(display.disTime,1000);
        setInterval(geoWhether.appdateData,60000);
    
});