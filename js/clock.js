window.onload = getTime(), getTemp();

function getTime() {
   var date = new Date();
   var time = date.toLocaleTimeString();
   var clockElement = document.getElementById("clock");
   
   clockElement.innerHTML = time;
   setTimeout(getTime, 1000);
}

function getTemp() {
   $.getJSON("https://api.forecast.io/forecast/b6392d0fd315033d4d14799a2fa54882/35.300399,-120.662362?callback=?", function(data) {
      $("#forecastLabel").html(data.daily.summary);
      $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");
      
      var className;
      var tempMax = data.daily.data[0].temperatureMax;
      
      if (tempMax >= 90)
         className = "hot";
      else if (tempMax >= 80)
         className = "warm";
      else if (tempMax >= 70)
         className = "nice";
      else if (tempMax >= 60)
         className = "chilly";
      else
         className = "cold";
      
      $("body").addClass(className);
   });
}
