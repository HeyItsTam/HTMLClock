window.onload = getTime(), getLocation(), getAllAlarms();

function getTime() {
   var date = new Date();
   var time = date.toLocaleTimeString();
   var clockElement = document.getElementById("clock");
   
   clockElement.innerHTML = time;
   setTimeout(getTime, 1000);
}

function getLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
         $("#forecastLabel").append("Forecast in your area...");
         getTemp(position.coords.latitude, position.coords.longitude);
      });
   } else {
      $("#forecastLabel").append("Forecast in San Luis Obispo, CA...");
      getTemp(null, null);
   }
}

function getTemp(latitude, longitude) {
   if (latitude == null && longitude == null) {
      // default coordinates in San Luis Obispo, CA
      latitude = "35.300399";
      longitude = "-120.662362";
   }
   var forecastLink = "https://api.forecast.io/forecast/";
   var apiKey = "b6392d0fd315033d4d14799a2fa54882";
   var position = latitude + "," + longitude;
   var callbackParam = "?callback=?";
   var url = forecastLink + apiKey + "/" + position + callbackParam;
   
   $.getJSON(url, function(data) {
      $("#forecastLabel").append('<h2>'+data.daily.summary+'</h2>');
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

function showAlarmPopup() {
   $("#mask").removeClass("hide");
   $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var time = hours + ":" + mins + " " + ampm;
   var alarmName = $("#alarmName").val();
   
   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
   
   alarmObject.save({"time": time, "alarmName": alarmName, "userId": userId}, {
      success: function(object) {
         insertAlarm(time, alarmName, alarmObject.id);
         hideAlarmPopup();
         
         ga('send', 'event', 'Alarm', 'Add');
      }
   });
}

function insertAlarm(time, alarmName, id) {
   if (alarmName != "") {
      alarmName += "&nbsp-&nbsp";
   }
   alarmName = "&nbsp&nbsp" + alarmName;
   
   var delButton = '<div><input type="button" value="x" onclick="deleteAlarm(\'' + id + '\')"/></div>';
   var divName = '<div class="name">' + alarmName + '</div>';
   var divTime = '<div class="time">' + time + '</div>';
   var newDiv = $('<div id="alarm' + id +'">').addClass("flexable");
   
   newDiv.append(delButton, divName, divTime + "<br><br>");
   $("#alarms").append(newDiv);
}

function deleteAlarm(id) {
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   
   query.get(id, {
      success: function(result) {
         result.destroy({});
         $("#alarm" + id).remove();
         
         ga('send', 'event', 'Alarm', 'Delete');
      }
   });
}

function getAllAlarms() {
   Parse.initialize("bdQVlFUkoIZrey6IvX7QsHq0pFpA78LPbGmaT6Dq", "oPZYXLcukxBuTrhBUx2Ej3vzzv14JPsjbmpZW31c");
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject); 

   query = query.contains('userId', userId).ascending('updatedAt');
   
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) { 
            insertAlarm(results[i].get("time"), results[i].get("alarmName"), results[i].id);
         }
      }
   });
}

function createAlarmContentBody() {
   var alarmHeader = $('<div id="alarmHeader">');
   alarmHeader.append('<h2>Alarms</h2>');
   alarmHeader.append('<input type="button" value="Add Alarm" class="button" onclick="showAlarmPopup()"/>');
   var alarms = $('<div id="alarms">');
   
   $('#alarmContainer').prepend(alarmHeader, alarms);
}